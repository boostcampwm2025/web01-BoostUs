import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '../generated/prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDetailItemDto } from './dto/project-detail-item.dto';
import { ProjectListItemDto } from './dto/project-list-item.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './project.repository';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'node:crypto';
import type Redis from 'ioredis';
import { REDIS } from '../redis/redis.provider';

@Injectable()
export class ProjectService {
  private readonly s3: S3Client;
  private readonly endpoint: string;
  private readonly bucket: string;

  constructor(
    private readonly projectRepository: ProjectRepository,
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

  async uploadTempThumbnail(file: Express.Multer.File, memberId: number) {
    const uploadId = randomUUID();
    const ext = (file.originalname.split('.').pop() || 'png').toLocaleLowerCase();
    const tempKey = `temp/projects/thumbnail/${uploadId}.${ext}`;

    const previewUrl = await this.uploadImage(file, tempKey);

    const redisKey = `upload:thumbnail:${uploadId}`;
    await this.redis.set(
      redisKey,
      JSON.stringify({
        uploadId,
        memberId,
        objectKey: tempKey,
        contentType: file.mimetype,
        status: 'TEMP',
        createdAt: Date.now(),
      }),
      'EX',
      3600,
    );

    return { uploadId, previewUrl };
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

  async create(dto: CreateProjectDto) {
    // 프로젝트 등록자 memberId는 인증 사용자에서 주입해야 함 -> 커스텀 데코레이터?
    const memberId = BigInt(1); // 임시 값

    return await this.projectRepository.create(memberId, dto);
  }

  async update(id: number, dto: UpdateProjectDto) {
    const projectId = BigInt(id);

    const exists = await this.projectRepository.exists(projectId);
    if (!exists) {
      throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    }

    return this.projectRepository.update(projectId, dto);
  }

  async delete(id: number) {
    const projectId = BigInt(id);

    const exists = await this.projectRepository.exists(projectId);
    if (!exists) {
      throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    }

    await this.projectRepository.deleteById(projectId);

    return { id };
  }
}
