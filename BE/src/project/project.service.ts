import { Injectable, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '../generated/prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDetailItemDto } from './dto/project-detail-item.dto';
import { ProjectListItemDto } from './dto/project-list-item.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './project.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { ConfigService } from '@nestjs/config';
import { CopyObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'node:crypto';
import type Redis from 'ioredis';
import { REDIS } from '../redis/redis.provider';
import { ThumbnailMeta } from './type/upload-image-meta.type';
import { GithubRepoReadmeResponse } from './type/github-repo-readme.type';
import { GithubRepoCollaboratorResponse } from './type/github-repo-collaborator.type';
import {
  ProjectNotFoundException,
  ProjectForbiddenException,
  ThumbnailUploadNotFoundException,
  InvalidThumbnailMetadataException,
  ThumbnailOwnershipException,
  MemberNotFoundException,
  RepositoryQueryRequiredException,
  InvalidRepositoryUrlException,
  GithubApiRequestFailedException,
} from './exception/project.exception';
import { ViewService } from 'src/view/view.service';
import { Role } from 'src/generated/prisma/enums';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectService {
  private readonly s3: S3Client;
  private readonly endpoint: string;
  private readonly bucket: string;
  private readonly githubAppId: string;
  private readonly githubAppPrivateKey: string;
  private readonly githubApiBase = 'https://api.github.com';

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly authRepository: AuthRepository,
    private readonly config: ConfigService,
    private readonly viewService: ViewService,
    private readonly jwtService: JwtService,
    private readonly http: HttpService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {
    this.endpoint = this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_ENDPOINT');
    this.bucket = this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_BUCKET');
    this.githubAppId = this.config.getOrThrow<string>('GITHUB_APP_ID');
    this.githubAppPrivateKey = this.config
      .getOrThrow<string>('GITHUB_APP_PRIVATE_KEY')
      .replace(/\\n/g, '\n');

    this.s3 = new S3Client({
      region: this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_REGION'),
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_ACCESS_KEY'),
        secretAccessKey: this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_SECRET_KEY'),
      },
      forcePathStyle: true,
      // false (default) : Virtual-hosted style
      // https://버킷이름.kr.object.ncloudstorage.com/파일경로
      // true : Path style -> NCP 는 path style 권장
      // https://kr.object.ncloudstorage.com/버킷이름/파일경로
    });
  }

  /**
   * JWT 생성에 사용하는 base64url 인코딩을 수행합니다.
   * @param input Buffer 또는 string
   * @returns base64url 인코딩 문자열
   */
  private _base64Url(input: Buffer | string) {
    return Buffer.from(input)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  /**
   * GitHub App 인증용 JWT를 생성합니다.
   * @returns GitHub App JWT
   */
  private _createGithubAppJwt(): string {
    const now = Math.floor(Date.now() / 1000);
    return this.jwtService.sign(
      { iat: now - 60, exp: now + 9 * 60, iss: this.githubAppId },
      {
        algorithm: 'RS256',
        privateKey: this.githubAppPrivateKey,
        header: { alg: 'RS256', typ: 'JWT' },
      },
    );
  }

  /**
   * repository URL에서 owner/repo를 파싱합니다.
   * @param repositoryUrl GitHub 레포 URL 또는 slug
   * @returns { owner, repo }
   */
  private _parseRepositorySlug(repositoryUrl: string) {
    const raw = repositoryUrl.trim();
    let path = raw;

    try {
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        path = new URL(raw).pathname;
      } else if (raw.includes('github.com/')) {
        path = new URL(`https://${raw}`).pathname;
      }
    } catch {
      // URL 파싱 실패는 아래에서 검증
    }

    const cleaned = path.replace(/^\/+/, '').replace(/\.git$/, '');
    const [owner, repo] = cleaned.split('/').filter(Boolean);

    if (!owner || !repo) {
      throw new InvalidRepositoryUrlException();
    }

    return { owner, repo };
  }

  /**
   * GitHub API에 요청하고 JSON을 파싱합니다.
   * @param url 요청 URL
   * @param init fetch 옵션
   * @returns 파싱된 JSON 응답
   */
  private async _githubFetch<T>(
    url: string,
    init?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers?: Record<string, string>;
      body?: string;
    },
  ): Promise<T> {
    try {
      const res = await firstValueFrom(
        this.http.request<T>({
          url,
          method: init?.method ?? 'GET',
          headers: init?.headers,
          data: init?.body,
        }),
      );

      return res.data;
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'response' in e) {
        const err = e as {
          response?: { status?: number; statusText?: string; data?: unknown };
        };

        throw new GithubApiRequestFailedException(
          err.response?.status ?? 500,
          err.response?.statusText ?? 'Unknown',
          typeof err.response?.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response?.data),
        );
      }

      throw e;
    }
  }

  /**
   * 지정한 repository의 installation access token을 발급받습니다.
   * @param owner GitHub owner
   * @param repo GitHub repo
   * @returns installation access token
   */
  private async _getInstallationAccessToken(owner: string, repo: string): Promise<string> {
    const appJwt = this._createGithubAppJwt();

    const installation = await this._githubFetch<{ id: number }>(
      `${this.githubApiBase}/repos/${owner}/${repo}/installation`,
      {
        headers: {
          Authorization: `Bearer ${appJwt}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    const accessToken = await this._githubFetch<{ token: string }>(
      `${this.githubApiBase}/app/installations/${installation.id}/access_tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${appJwt}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    return accessToken.token;
  }

  async uploadTempThumbnail(file: Express.Multer.File, memberId: string) {
    const uploadId = randomUUID();
    const ext = (file.originalname.split('.').pop() || 'png').toLocaleLowerCase();
    const tempKey = `temp/projects/thumbnail/${uploadId}.${ext}`;

    const thumbnailUrl = await this.uploadImage(file, tempKey);

    const redisKey = `upload:thumbnail:${uploadId}`;
    await this.redis.set(
      redisKey,
      JSON.stringify({
        uploadId,
        memberId: memberId,
        objectKey: tempKey,
      }),
      'EX',
      3600,
    );

    return { thumbnailUploadId: uploadId, thumbnailUrl };
  }

  /**
   * Redis에 저장된 TEMP 썸네일 메타를 검증한 뒤, Object Storage의 temp key -> final key 로 확정합니다.
   * 성공 시: Redis 메타 삭제 + finalKey 반환
   */
  private async finalizeThumbnailOrThrow(
    uploadId: string | undefined,
    memberId: string,
  ): Promise<string> {
    const redisKey = `upload:thumbnail:${uploadId}`;

    const rawMeta = await this.redis.get(redisKey);
    if (!rawMeta) {
      throw new ThumbnailUploadNotFoundException();
    }

    const meta = this.parseThumbnailMetaOrThrow(rawMeta);
    if (meta.uploadId !== uploadId) {
      throw new ThumbnailUploadNotFoundException();
    }

    if (meta.memberId !== memberId.toString()) {
      throw new ThumbnailOwnershipException();
    }

    const ext = (meta.objectKey.split('.').pop() || 'png').toLowerCase();
    const finalKey = `projects/thumbnail/${randomUUID()}.${ext}`;

    // temp -> final 복사
    await this.s3.send(
      new CopyObjectCommand({
        Bucket: this.bucket,
        Key: finalKey,
        CopySource: `${this.bucket}/${encodeURI(meta.objectKey)}`,
        ACL: 'public-read',
        MetadataDirective: 'COPY',
      }),
    );

    // temp 삭제
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: meta.objectKey,
      }),
    );

    await this.redis.del(redisKey);

    return finalKey;
  }

  private parseThumbnailMetaOrThrow(raw: string): ThumbnailMeta {
    let meta: unknown;

    try {
      meta = JSON.parse(raw);
    } catch {
      throw new InvalidThumbnailMetadataException('썸네일 업로드 메타데이터가 손상되었습니다.');
    }

    // if (
    //   !meta ||
    //   typeof meta !== 'object' ||
    //   typeof (meta as any).uploadId !== 'string' ||
    //   typeof (meta as any).memberId !== 'string' ||
    //   typeof (meta as any).objectKey !== 'string'
    // ) {
    //   throw new InvalidThumbnailMetadataException(
    //     '썸네일 업로드 메타데이터 형식이 올바르지 않습니다.',
    //   );
    // }

    return meta as ThumbnailMeta;
  }

  private _createS3Client() {
    return new S3Client({
      region: this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_REGION'),
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_ACCESS_KEY'),
        secretAccessKey: this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
  }

  private _isTimeSkewError(e: unknown) {
    if (!e || typeof e !== 'object') return false;

    const err = e as { name?: unknown; message?: unknown };
    const name = typeof err.name === 'string' ? err.name : '';
    const message = typeof err.message === 'string' ? err.message : '';

    return name === 'RequestTimeTooSkewed' || message.includes('RequestTimeTooSkewed');
  }

  async uploadImage(file: Express.Multer.File, key: string): Promise<string> {
    const run = async (client: S3Client) => {
      const uploader = new Upload({
        client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
          // 'private' (default): 본인만 접근 가능, URL로 직접 접근 불가
          // 'public-read': 누구나 읽기 가능, URL로 직접 접근 가능
          // 'public-read-write': 누구나 읽기/쓰기 가능 (위험)
          // 'authenticated-read': 인증된 사용자만 읽기 가능
        },
      });
      await uploader.done();
    };

    try {
      await run(this.s3);
    } catch (e: any) {
      if (!this._isTimeSkewError(e)) throw e;

      // client 재생성 후 1회 재시도
      const retryClient = this._createS3Client();
      await run(retryClient);
    }

    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  /**
   * GitHub 레포의 collaborator 목록을 조회합니다.
   * @param repositoryUrl GitHub 레포 URL 또는 slug
   * @returns collaborator 목록 (githubId, avatarUrl)
   */
  async getRepoCollaborators(repositoryUrl: string) {
    if (!repositoryUrl) {
      throw new RepositoryQueryRequiredException();
    }

    const { owner, repo } = this._parseRepositorySlug(repositoryUrl);
    const installationAccessToken = await this._getInstallationAccessToken(owner, repo);

    const collaborators = await this._githubFetch<GithubRepoCollaboratorResponse[]>(
      `${this.githubApiBase}/repos/${owner}/${repo}/collaborators?affiliation=direct`,
      {
        headers: {
          Authorization: `Bearer ${installationAccessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    return collaborators.map((collaborator) => ({
      githubId: collaborator.login,
      avatarUrl: collaborator.avatar_url ?? null,
    }));
  }

  /**
   * GitHub 레포의 README를 조회합니다.
   * @param repositoryUrl GitHub 레포 URL 또는 slug
   * @returns README 메타 및 본문
   */
  async getRepoReadme(repositoryUrl: string) {
    if (!repositoryUrl) {
      throw new RepositoryQueryRequiredException();
    }

    const { owner, repo } = this._parseRepositorySlug(repositoryUrl);
    const installationAccessToken = await this._getInstallationAccessToken(owner, repo);

    const readme = await this._githubFetch<GithubRepoReadmeResponse>(
      `${this.githubApiBase}/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Authorization: `Bearer ${installationAccessToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    const decodedContent =
      readme.encoding === 'base64'
        ? Buffer.from(readme.content, 'base64').toString('utf-8')
        : readme.content;

    return {
      name: readme.name,
      path: readme.path,
      htmlUrl: readme.html_url,
      downloadUrl: readme.download_url,
      encoding: 'utf-8',
      content: decodedContent,
    };
  }

  async findAll(query: ProjectListQueryDto) {
    const where: Prisma.ProjectWhereInput = {};
    if (query.cohort) {
      where.cohort = query.cohort;
    }
    if (query.field) {
      where.field = query.field;
    }

    const { projects } = await this.projectRepository.findAll(
      Object.keys(where).length > 0 ? where : undefined,
    );

    const items = plainToInstance(ProjectListItemDto, projects, {
      excludeExtraneousValues: true,
    });

    return {
      items,
      meta: {},
    };
  }

  async findOne(id: number) {
    const projectId = BigInt(id);

    const project = await this.projectRepository.findById(projectId);

    const data = plainToInstance(ProjectDetailItemDto, project, {
      excludeExtraneousValues: true,
    });

    return data;
  }

  async findOneWithViewCount(id: number, viewerKey: string) {
    const projectId = BigInt(id);

    const firstView = await this.viewService.shouldIncrementView('project', id, viewerKey);

    if (firstView) {
      const project = await this.projectRepository.incrementViewCountAndFind(projectId);
      return plainToInstance(ProjectDetailItemDto, project, { excludeExtraneousValues: true });
    }

    const project = await this.projectRepository.findById(projectId);
    return plainToInstance(ProjectDetailItemDto, project, { excludeExtraneousValues: true });
  }

  async create(memberId: string, dto: CreateProjectDto) {
    const finalKey = dto.thumbnailUploadId
      ? await this.finalizeThumbnailOrThrow(dto.thumbnailUploadId, memberId)
      : undefined;

    const memberIdBigint = BigInt(memberId);
    const project = await this.projectRepository.create(memberIdBigint, dto, finalKey);

    return plainToInstance(ProjectDetailItemDto, project, { excludeExtraneousValues: true });
  }

  async update(id: number, memberId: string, dto: UpdateProjectDto) {
    const projectId = BigInt(id);

    const exists = await this.projectRepository.exists(projectId);
    if (!exists) {
      throw new ProjectNotFoundException(id);
    }

    // member.github_login 조회
    const member = await this.authRepository.findById(memberId);
    if (!member?.githubLogin) {
      throw new MemberNotFoundException();
    }

    // ADMIN이거나 project_participants에 포함된 경우 수정 가능
    const canUpdate =
      member.role === Role.ADMIN ||
      (await this.projectRepository.canMemberUpdateProject(projectId, member.githubLogin));

    if (!canUpdate) {
      throw new ProjectForbiddenException('이 프로젝트를 수정할 권한이 없습니다.');
    }

    // 있으면 finalize
    const finalKey = dto.thumbnailUploadId
      ? await this.finalizeThumbnailOrThrow(dto.thumbnailUploadId, memberId)
      : undefined;

    const updated = await this.projectRepository.update(projectId, dto, finalKey);
    return plainToInstance(ProjectDetailItemDto, updated, { excludeExtraneousValues: true });
  }

  async delete(id: number, memberId: string) {
    const projectId = BigInt(id);

    // 프로젝트 존재 여부 확인
    const exists = await this.projectRepository.exists(projectId);
    if (!exists) {
      throw new ProjectNotFoundException(id);
    }

    // member.github_login 조회
    const member = await this.authRepository.findById(memberId);
    if (!member?.githubLogin) {
      throw new MemberNotFoundException();
    }

    // ADMIN이거나 project_participants에 포함된 경우 삭제 가능
    const canDelete =
      member.role === Role.ADMIN ||
      (await this.projectRepository.canMemberUpdateProject(projectId, member.githubLogin));

    if (!canDelete) {
      throw new ProjectForbiddenException('이 프로젝트를 삭제할 권한이 없습니다.');
    }

    await this.projectRepository.deleteById(projectId);

    return { id };
  }
}
