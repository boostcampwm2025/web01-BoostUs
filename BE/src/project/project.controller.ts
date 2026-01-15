import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // 전체조회/조건조회
  @Get()
  findAll(@Query() query: ProjectListQueryDto) {
    return this.projectService.findAll(query);
  }

  // 단일조회
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  // 생성
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  // // 수정
  // @Patch(':id')
  // update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
  //   return this.projectService.update(id, dto);
  // }

  // 삭제
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.delete(id);
  }
}
