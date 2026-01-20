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
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDetailItemDto } from './dto/project-detail-item.dto';
import { ProjectListItemDto } from './dto/project-list-item.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@ApiTags('프로젝트')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
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
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
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
    status: 200,
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto);
  }

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
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.delete(id);
  }
}
