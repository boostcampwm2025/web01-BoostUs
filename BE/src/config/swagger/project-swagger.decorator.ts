import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';
import { ProjectDetailItemDto } from 'src/project/dto/project-detail-item.dto';
import { ProjectParticipantDto } from 'src/project/dto/project-participant.dto';
import { ProjectListItemDto } from 'src/project/dto/project-list-item.dto';
import { UpdateProjectDto } from 'src/project/dto/update-project.dto';
import { ProjectField } from 'src/project/type/project-field.type';
import {
  errorResponseSchema,
  successResponseSchema,
} from 'src/config/swagger/swagger-response.schema';

export function GetAllProjectSwagger() {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto, ProjectListItemDto),
    ApiOperation({
      summary: '프로젝트 목록 조회',
      description:
        '프로젝트 목록을 조회합니다. cohort(기수), field(분야) 조건으로 필터링할 수 있으며, 응답 data는 items와 meta로 구성됩니다.',
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
      schema: successResponseSchema({
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(ProjectListItemDto) },
          },
          meta: {
            type: 'object',
            description: '추가 메타 정보',
            example: {},
          },
        },
        required: ['items', 'meta'],
      }),
    }),
    ApiResponse({
      status: 400,
      description: '쿼리 파라미터 검증 실패',
      schema: errorResponseSchema(400, 'VALIDATION_ERROR', '입력값이 유효하지 않습니다.'),
    }),
  );
}

export function GetProjectSwagger() {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto, ProjectDetailItemDto),
    ApiOperation({
      summary: '프로젝트 상세 조회',
      description: '프로젝트 ID로 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '프로젝트 ID',
      example: 1,
      schema: { type: 'integer', minimum: 1 },
    }),
    ApiResponse({
      status: 200,
      description: '프로젝트 상세 조회 성공',
      schema: successResponseSchema({ $ref: getSchemaPath(ProjectDetailItemDto) }),
    }),
    ApiResponse({
      status: 400,
      description: 'path 파라미터 검증 실패',
      schema: errorResponseSchema(400, 'VALIDATION_ERROR', '입력값이 유효하지 않습니다.'),
    }),
    ApiResponse({
      status: 404,
      description: '프로젝트를 찾을 수 없음',
      schema: errorResponseSchema(404, 'PROJECT_NOT_FOUND', '프로젝트를 찾을 수 없습니다.'),
    }),
  );
}

export function CreateProjectSwagger() {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto, CreateProjectDto, ProjectDetailItemDto),
    ApiOperation({
      summary: '프로젝트 생성',
      description:
        '새로운 프로젝트를 생성합니다. thumbnailUploadId를 전달하면 검증 후 임시 썸네일을 최종 썸네일로 확정합니다.',
    }),
    ApiBody({
      type: CreateProjectDto,
    }),
    ApiResponse({
      status: 201,
      description: '프로젝트 생성 성공',
      schema: successResponseSchema({ $ref: getSchemaPath(ProjectDetailItemDto) }),
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
      schema: errorResponseSchema(400, 'VALIDATION_ERROR', '입력값이 유효하지 않습니다.'),
    }),
    ApiResponse({
      status: 401,
      description: '인증 필요',
      schema: errorResponseSchema(401, 'UNAUTHORIZED', '인증이 필요합니다.'),
    }),
    ApiResponse({
      status: 403,
      description: '썸네일 소유권 불일치',
      schema: errorResponseSchema(
        403,
        'THUMBNAIL_OWNERSHIP_MISMATCH',
        '본인이 업로드한 썸네일이 아닙니다.',
      ),
    }),
    ApiResponse({
      status: 404,
      description: '썸네일 업로드 정보 또는 사용자 없음',
      schema: errorResponseSchema(
        404,
        'THUMBNAIL_UPLOAD_NOT_FOUND',
        '썸네일 업로드 정보를 찾을 수 없습니다.',
      ),
    }),
  );
}

export function UpdateProjectSwagger() {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto, UpdateProjectDto, ProjectDetailItemDto),
    ApiOperation({
      summary: '프로젝트 수정',
      description:
        '특정 프로젝트를 부분 수정합니다. participants와 techStack을 전달하면 기존 값은 전달된 목록으로 전체 교체됩니다.',
    }),
    ApiParam({
      name: 'id',
      description: '프로젝트 ID',
      example: 1,
      schema: { type: 'integer', minimum: 1 },
    }),
    ApiBody({
      type: UpdateProjectDto,
    }),
    ApiResponse({
      status: 200,
      description: '프로젝트 수정 성공',
      schema: successResponseSchema({ $ref: getSchemaPath(ProjectDetailItemDto) }),
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
      schema: errorResponseSchema(400, 'VALIDATION_ERROR', '입력값이 유효하지 않습니다.'),
    }),
    ApiResponse({
      status: 404,
      description: '프로젝트를 찾을 수 없음',
      schema: errorResponseSchema(404, 'PROJECT_NOT_FOUND', '프로젝트를 찾을 수 없습니다.'),
    }),
    ApiResponse({
      status: 401,
      description: '인증 필요',
      schema: errorResponseSchema(401, 'UNAUTHORIZED', '인증이 필요합니다.'),
    }),
    ApiResponse({
      status: 403,
      description: '수정 권한 없음',
      schema: errorResponseSchema(
        403,
        'PROJECT_FORBIDDEN',
        '이 프로젝트를 수정할 권한이 없습니다.',
      ),
    }),
  );
}

export function DeleteProjectSwagger() {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto),
    ApiOperation({
      summary: '프로젝트 삭제',
      description: '특정 프로젝트를 삭제합니다. 관리자 권한이 필요합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '프로젝트 ID',
      example: 1,
      schema: { type: 'integer', minimum: 1 },
    }),
    ApiResponse({
      status: 200,
      description: '프로젝트 삭제 성공',
      schema: successResponseSchema({
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
        },
        required: ['id'],
      }),
    }),
    ApiResponse({
      status: 400,
      description: 'path 파라미터 검증 실패',
      schema: errorResponseSchema(400, 'VALIDATION_ERROR', '입력값이 유효하지 않습니다.'),
    }),
    ApiResponse({
      status: 404,
      description: '프로젝트를 찾을 수 없음',
      schema: errorResponseSchema(404, 'PROJECT_NOT_FOUND', '프로젝트를 찾을 수 없습니다.'),
    }),
    ApiResponse({
      status: 401,
      description: '인증 필요',
      schema: errorResponseSchema(401, 'UNAUTHORIZED', '인증이 필요합니다.'),
    }),
    ApiResponse({
      status: 403,
      description: '삭제 권한 없음',
      schema: errorResponseSchema(
        403,
        'PROJECT_FORBIDDEN',
        '이 프로젝트를 삭제할 권한이 없습니다.',
      ),
    }),
  );
}

export function UploadImageSwagger() {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto),
    ApiOperation({
      summary: '프로젝트 썸네일 임시 업로드',
      description:
        '프로젝트 썸네일 이미지를 multipart/form-data로 임시 업로드하고, 생성/수정에서 사용할 thumbnailUploadId와 thumbnailUrl을 반환합니다.',
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
      schema: successResponseSchema({
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
        required: ['thumbnailUploadId', 'thumbnailUrl'],
      }),
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
      schema: errorResponseSchema(400, 'VALIDATION_ERROR', '입력값이 유효하지 않습니다.'),
    }),
    ApiResponse({
      status: 401,
      description: '인증 필요',
      schema: errorResponseSchema(401, 'UNAUTHORIZED', '인증이 필요합니다.'),
    }),
  );
}

export function GetCollaboratorSwagger() {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto, ProjectParticipantDto),
    ApiOperation({
      summary: 'Github 레포지토리에서 collaborator 목록 조회',
      description:
        'repository 쿼리(owner/repo 또는 URL)로 전달된 GitHub 레포지토리의 collaborator 목록을 조회합니다.',
    }),
    ApiQuery({
      name: 'repository',
      required: true,
      type: String,
      description: 'GitHub repository URL',
      example: 'https://github.com/boostcampw2025/web01-boostus',
    }),
    ApiResponse({
      status: 200,
      description: 'collaborator 목록 조회 성공',
      schema: successResponseSchema({
        type: 'array',
        items: { $ref: getSchemaPath(ProjectParticipantDto) },
      }),
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 repository 파라미터',
      schema: errorResponseSchema(
        400,
        'INVALID_REPOSITORY_URL',
        'repositoryUrl 형식이 올바르지 않습니다.',
      ),
    }),
    ApiResponse({
      status: 502,
      description: 'GitHub API 요청 실패',
      schema: errorResponseSchema(
        502,
        'GITHUB_API_REQUEST_FAILED',
        'GitHub API 요청에 실패했습니다.',
      ),
    }),
  );
}

export function GetReadmeSwagger() {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto),
    ApiOperation({
      summary: '레포지토리 README 조회',
      description:
        'repository 쿼리(owner/repo 또는 URL)로 전달된 GitHub 레포지토리의 README 메타데이터와 본문을 조회합니다.',
    }),
    ApiQuery({
      name: 'repository',
      required: true,
      type: String,
      description: 'GitHub repository URL',
      example: 'https://github.com/boostcampw2025/web01-boostus',
    }),
    ApiResponse({
      status: 200,
      description: 'README 조회 성공',
      schema: successResponseSchema({
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
        required: ['name', 'path', 'htmlUrl', 'encoding', 'content'],
      }),
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 repository 파라미터',
      schema: errorResponseSchema(
        400,
        'INVALID_REPOSITORY_URL',
        'repositoryUrl 형식이 올바르지 않습니다.',
      ),
    }),
    ApiResponse({
      status: 502,
      description: 'GitHub API 요청 실패',
      schema: errorResponseSchema(
        502,
        'GITHUB_API_REQUEST_FAILED',
        'GitHub API 요청에 실패했습니다.',
      ),
    }),
  );
}
