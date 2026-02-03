import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exception/base.exception';

/**
 * 프로젝트를 찾을 수 없을 때
 */
export class ProjectNotFoundException extends BaseException {
  constructor(projectId?: number) {
    super(
      'PROJECT_NOT_FOUND',
      '프로젝트를 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
      projectId ? { projectId } : undefined,
    );
  }
}

/**
 * 프로젝트 수정/삭제 권한이 없을 때
 */
export class ProjectForbiddenException extends BaseException {
  constructor(message = '이 프로젝트에 대한 수정/삭제 권한이 없습니다.') {
    super('PROJECT_FORBIDDEN', message, HttpStatus.FORBIDDEN);
  }
}

/**
 * 썸네일 업로드 정보를 찾을 수 없을 때 (만료 또는 존재하지 않음)
 */
export class ThumbnailUploadNotFoundException extends BaseException {
  constructor(message = '썸네일 업로드 정보를 찾을 수 없습니다.') {
    super('THUMBNAIL_UPLOAD_NOT_FOUND', message, HttpStatus.NOT_FOUND);
  }
}

/**
 * 썸네일 업로드 메타데이터가 손상되었거나 형식이 잘못되었을 때
 */
export class InvalidThumbnailMetadataException extends BaseException {
  constructor(message = '썸네일 업로드 메타데이터가 올바르지 않습니다.') {
    super('INVALID_THUMBNAIL_METADATA', message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 본인이 업로드한 썸네일이 아닐 때
 */
export class ThumbnailOwnershipException extends BaseException {
  constructor() {
    super(
      'THUMBNAIL_OWNERSHIP_MISMATCH',
      '본인이 업로드한 썸네일이 아닙니다.',
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * 사용자 정보를 찾을 수 없을 때
 */
export class MemberNotFoundException extends BaseException {
  constructor() {
    super('MEMBER_NOT_FOUND', '사용자 정보를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  }
}

/**
 * repository 쿼리 파라미터가 없을 때
 */
export class RepositoryQueryRequiredException extends BaseException {
  constructor() {
    super(
      'REPOSITORY_QUERY_REQUIRED',
      'repository 쿼리 파라미터가 필요합니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * GitHub 레포 URL/slug 형식이 올바르지 않을 때
 */
export class InvalidRepositoryUrlException extends BaseException {
  constructor() {
    super(
      'INVALID_REPOSITORY_URL',
      'repositoryUrl 형식이 올바르지 않습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * GitHub App Private Key 설정이 누락되었을 때
 */
export class GithubAppKeyNotConfiguredException extends BaseException {
  constructor() {
    super(
      'GITHUB_APP_KEY_NOT_CONFIGURED',
      'GITHUB_APP_PRIVATE_KEY 또는 GITHUB_APP_PRIVATE_KEY_PATH 설정이 필요합니다.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * GitHub API 호출이 실패했을 때
 */
export class GithubApiRequestFailedException extends BaseException {
  constructor(status: number, statusText: string, body: string) {
    super('GITHUB_API_REQUEST_FAILED', 'GitHub API 요청에 실패했습니다.', HttpStatus.BAD_GATEWAY, {
      status,
      statusText,
      body,
    });
  }
}
