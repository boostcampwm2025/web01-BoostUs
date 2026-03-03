/* eslint-disable @typescript-eslint/naming-convention */

import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';
import { ProjectDetailItemDto } from 'src/project/dto/project-detail-item.dto';
import { ProjectParticipantDto } from 'src/project/dto/project-participant.dto';
import { ProjectListItemDto } from 'src/project/dto/project-list-item.dto';
import { UpdateProjectDto } from 'src/project/dto/update-project.dto';
import { ProjectField } from 'src/project/type/project-field.type';

export function GetAllProjectSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '프로젝트 목록 조회',
      description: '프로젝트 목록을 조회합니다.',
    }),
    ApiQuery({
      name: 'cohort',
      required: false,
      type: Number,
      description: '부스트캠프 기수 필터',
      example: 10,
    }),
    ApiQuery({
      name: 'field',
      required: false,
      enum: ProjectField,
      description: '프로젝트 분야 필터',
      example: ProjectField.WEB,
    }),
    ApiResponse({
      status: 200,
      description: '프로젝트 목록 조회 성공',
      type: [ProjectListItemDto],
    }),
  );
}

export function GetProjectSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '프로젝트 단일 조회',
      description: '특정 프로젝트의 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '프로젝트 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '프로젝트 상세 조회 성공',
      type: ProjectDetailItemDto,
    }),
    ApiResponse({
      status: 404,
      description: '프로젝트를 찾을 수 없음',
    }),
  );
}

export function CreateProjectSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '프로젝트 생성',
      description: '새로운 프로젝트를 생성합니다.',
    }),
    ApiBody({
      type: CreateProjectDto,
    }),
    ApiResponse({
      status: 201,
      description: '프로젝트 생성 성공',
      type: ProjectDetailItemDto,
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
    }),
    ApiResponse({
      status: 401,
      description: '인증 필요',
    }),
  );
}

export function UpdateProjectSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '프로젝트 수정',
      description: '특정 프로젝트를 수정합니다. participants와 techStack은 전체 교체됩니다.',
    }),
    ApiParam({
      name: 'id',
      description: '프로젝트 ID',
      example: 1,
    }),
    ApiBody({
      type: UpdateProjectDto,
    }),
    ApiResponse({
      status: 200,
      description: '프로젝트 수정 성공',
      type: ProjectDetailItemDto,
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
    }),
    ApiResponse({
      status: 404,
      description: '프로젝트를 찾을 수 없음',
    }),
    ApiResponse({
      status: 401,
      description: '인증 필요',
    }),
    ApiResponse({
      status: 403,
      description: '수정 권한 없음',
    }),
  );
}

export function DeleteProjectSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '프로젝트 삭제',
      description: '특정 프로젝트를 삭제합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '프로젝트 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '프로젝트 삭제 성공',
    }),
    ApiResponse({
      status: 404,
      description: '프로젝트를 찾을 수 없음',
    }),
    ApiResponse({
      status: 401,
      description: '인증 필요',
    }),
    ApiResponse({
      status: 403,
      description: '삭제 권한 없음',
    }),
  );
}

export function UploadImageSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '프로젝트 썸네일 임시 업로드',
      description:
        '프로젝트 썸네일 이미지를 임시 업로드하고, 생성/수정 시 사용할 uploadId와 사용자에게 보여줄 URL을 반환합니다.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: '업로드할 이미지 파일',
          },
        },
        required: ['file'],
      },
    }),
    ApiResponse({
      status: 201,
      description: '썸네일 임시 업로드 성공',
      schema: {
        type: 'object',
        properties: {
          thumbnailUploadId: {
            type: 'string',
            example: 'cc67be56-9026-4600-8444-b9c1fe399cf0',
          },
          thumbnailUrl: {
            type: 'string',
            example:
              'https://kr.object.ncloudstorage.com/my-bucket/temp/projects/thumbnail/cc67be56-9026-4600-8444-b9c1fe399cf0.png',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
    }),
    ApiResponse({
      status: 401,
      description: '인증 필요',
    }),
  );
}

export function GetCollaboratorSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Github 레포지토리에서 collaborator 목록 조회',
      description: '쿼리 파라미터로 전달된 GitHub 레포지토리의 collaborator 목록을 조회합니다.',
    }),
    ApiQuery({
      name: 'repository',
      required: true,
      type: String,
      description: 'GitHub repository URL 또는 owner/repo slug',
      example: 'https://github.com/octocat/Hello-World',
    }),
    ApiResponse({
      status: 200,
      description: 'collaborator 목록 조회 성공',
      type: [ProjectParticipantDto],
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 repository 파라미터',
    }),
  );
}

export function GetReadmeSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '레포지토리 README 조회',
      description: '쿼리 파라미터로 전달된 GitHub 레포지토리의 README 본문을 가져옵니다.',
    }),
    ApiQuery({
      name: 'repository',
      required: true,
      type: String,
      description: 'GitHub repository URL 또는 owner/repo slug',
      example: 'https://github.com/octocat/Hello-World',
    }),
    ApiResponse({
      status: 200,
      description: 'README 조회 성공',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'README.md' },
          path: { type: 'string', example: 'README.md' },
          htmlUrl: { type: 'string', example: 'https://github.com/org/repo/blob/main/README.md' },
          downloadUrl: {
            type: 'string',
            example: 'https://raw.githubusercontent.com/org/repo/main/README.md',
            nullable: true,
          },
          encoding: { type: 'string', example: 'utf-8' },
          content: { type: 'string', description: 'README 본문 문자열' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 repository 파라미터',
    }),
  );
}
