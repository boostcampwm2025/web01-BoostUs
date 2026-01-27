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
import {
  ProjectNotFoundException,
  ProjectForbiddenException,
  ThumbnailUploadNotFoundException,
  InvalidThumbnailMetadataException,
  ThumbnailOwnershipException,
  MemberNotFoundException,
} from './exception/project.exception';

@Injectable()
export class ProjectService {
  private readonly s3: S3Client;
  private readonly endpoint: string;
  private readonly bucket: string;

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly authRepository: AuthRepository,
    private readonly config: ConfigService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {
    this.endpoint = this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_ENDPOINT');
    this.bucket = this.config.getOrThrow<string>('NCP_OBJECT_STORAGE_BUCKET');

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
        contentType: file.mimetype,
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

    if (
      !meta ||
      typeof meta !== 'object' ||
      typeof (meta as any).uploadId !== 'string' ||
      typeof (meta as any).memberId !== 'string' ||
      typeof (meta as any).objectKey !== 'string'
    ) {
      throw new InvalidThumbnailMetadataException(
        '썸네일 업로드 메타데이터 형식이 올바르지 않습니다.',
      );
    }

    return meta as ThumbnailMeta;
  }

  async uploadImage(file: Express.Multer.File, key: string): Promise<string> {
    const uploader = new Upload({
      client: this.s3,
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

    return `${this.endpoint}/${this.bucket}/${key}`;
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

  async create(memberId: string, dto: CreateProjectDto) {
    const finalKey = await this.finalizeThumbnailOrThrow(dto.thumbnailUploadId, memberId);

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

    // member.github_login 이 project_participants 조회 결과 들어있는지 확인
    const canUpdate = await this.projectRepository.canMemberUpdateProject(
      projectId,
      member.githubLogin,
    );

    // 없으면 throw
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

    // member.github_login 이 project_participants에 조회 결과 들어있는지 확인
    const canDelete = await this.projectRepository.canMemberUpdateProject(
      projectId,
      member.githubLogin,
    );

    if (!canDelete) {
      throw new ProjectForbiddenException('이 프로젝트를 삭제할 권한이 없습니다.');
    }

    await this.projectRepository.deleteById(projectId);

    return { id };
  }
}
