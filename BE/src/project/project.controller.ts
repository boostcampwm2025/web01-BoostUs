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
import { ProjectsService } from './project.service';
import { GetProjectQueryDto } from './dto/get-project.query.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
// import { ResponseMessage } from '../core/response/response-message.decorator';

@Controller('/api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  // @ResponseMessage('프로젝트 목록 조회 성공')
  findAll(@Query() query: GetProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  // @ResponseMessage('프로젝트 상세 조회 성공')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Post()
  // @ResponseMessage('프로젝트 생성 성공')
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  // @ResponseMessage('프로젝트 수정 성공')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  // @ResponseMessage('프로젝트 삭제 성공')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
