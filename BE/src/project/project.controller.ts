import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDetailItemDto } from './dto/project-detail-item.dto';
import { ProjectListItemDto } from './dto/project-list-item.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';
import { ProjectParticipantDto } from './dto/project-participant.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';
import { CurrentMember } from 'src/auth/decorator/current-member.decorator';
import { ViewerKeyGuard } from 'src/view/guard/view.guard';
import { ViewerKey } from 'src/view/decorator/viewer-key.decorator';

@ApiTags('프로젝트')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('uploads/thumbnails')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTempThumbnail(
    @CurrentMember() memberId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectService.uploadTempThumbnail(file, memberId);
  }

  @Public()
  @Get('/collaborators')
  @ApiOperation({
    summary: '레포지토리 collaborator 목록 조회',
    description:
      'repository 쿼리 파라미터로 전달된 GitHub 레포지토리의 collaborator 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'collaborator 목록 조회 성공',
    type: [ProjectParticipantDto],
  })
  async getCollaborators(@Query('repository') repositoryUrl: string) {
    return this.projectService.getRepoCollaborators(repositoryUrl);
  }

  @Public()
  @Get('/readme')
  @ApiOperation({
    summary: '레포지토리 README 조회',
    description: 'repository 쿼리 파라미터로 전달된 GitHub 레포지토리의 README 본문을 가져옵니다.',
  })
  @ApiResponse({
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
  })
  async getReadme(@Query('repository') repositoryUrl: string) {
    return this.projectService.getRepoReadme(repositoryUrl);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: '프로젝트 목록 조회',
    description:
      '프로젝트 목록을 조회합니다. 페이지네이션, 기수, 기술 스택으로 필터링할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '프로젝트 목록 조회 성공',
    type: [ProjectListItemDto],
  })
  findAll(@Query() query: ProjectListQueryDto) {
    return this.projectService.findAll(query);
  }

  @Public()
  @UseGuards(ViewerKeyGuard)
  @Get(':id')
  @ApiOperation({
    summary: '프로젝트 상세 조회',
    description: '특정 프로젝트의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '프로젝트 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '프로젝트 상세 조회 성공',
    type: ProjectDetailItemDto,
  })
  @ApiResponse({
    status: 404,
    description: '프로젝트를 찾을 수 없음',
  })
  findOne(@Param('id', ParseIntPipe) id: number, @ViewerKey() viewerKey: string) {
    return this.projectService.findOneWithViewCount(id, viewerKey);
  }

  @Post()
  @ApiOperation({
    summary: '프로젝트 생성',
    description: '새로운 프로젝트를 생성합니다.',
  })
  @ApiBody({
    type: CreateProjectDto,
  })
  @ApiResponse({
    status: 201,
    description: '프로젝트 생성 성공',
    type: ProjectDetailItemDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  create(@CurrentMember() memberId: string, @Body() dto: CreateProjectDto) {
    return this.projectService.create(memberId, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '프로젝트 수정',
    description: '특정 프로젝트를 수정합니다. participants와 techStack은 전체 교체됩니다.',
  })
  @ApiParam({
    name: 'id',
    description: '프로젝트 ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateProjectDto,
  })
  @ApiResponse({
    description: '프로젝트 수정 성공',
    type: ProjectDetailItemDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 404,
    description: '프로젝트를 찾을 수 없음',
  })
  update(
    @CurrentMember() memberId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, memberId, dto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({
    summary: '프로젝트 삭제',
    description: '특정 프로젝트를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '프로젝트 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '프로젝트 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '프로젝트를 찾을 수 없음',
  })
  delete(@CurrentMember() memberId: string, @Param('id', ParseIntPipe) id: number) {
    return this.projectService.delete(id, memberId);
  }
}
