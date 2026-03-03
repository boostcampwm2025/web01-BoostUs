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
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';
import { CurrentMember } from 'src/auth/decorator/current-member.decorator';
import { ViewerKeyGuard } from 'src/view/guard/view.guard';
import { ViewerKey } from 'src/view/decorator/viewer-key.decorator';

import {
  GetProjectSwagger,
  GetAllProjectSwagger,
  CreateProjectSwagger,
  UpdateProjectSwagger,
  DeleteProjectSwagger,
  UploadImageSwagger,
  GetCollaboratorSwagger,
  GetReadmeSwagger,
} from 'src/config/swagger/project-swagger.decorator';

@ApiTags('프로젝트')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Public()
  @Get()
  @GetAllProjectSwagger()
  findAll(@Query() query: ProjectListQueryDto) {
    return this.projectService.findAll(query);
  }

  @Public()
  @UseGuards(ViewerKeyGuard)
  @Get(':id')
  @GetProjectSwagger()
  findOne(@Param('id', ParseIntPipe) id: number, @ViewerKey() viewerKey: string) {
    return this.projectService.findOneWithViewCount(id, viewerKey);
  }

  @Post()
  @CreateProjectSwagger()
  create(@CurrentMember() memberId: bigint, @Body() dto: CreateProjectDto) {
    return this.projectService.create(memberId, dto);
  }

  @Patch(':id')
  @UpdateProjectSwagger()
  update(
    @CurrentMember() memberId: bigint,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, memberId, dto);
  }

  @Delete(':id')
  @DeleteProjectSwagger()
  delete(@CurrentMember() memberId: bigint, @Param('id', ParseIntPipe) id: number) {
    return this.projectService.delete(id, memberId);
  }

  @Post('uploads/thumbnails')
  @UploadImageSwagger()
  @UseInterceptors(FileInterceptor('file'))
  async uploadTempThumbnail(
    @CurrentMember() memberId: bigint,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectService.uploadTempThumbnail(file, memberId);
  }

  @Public()
  @Get('/collaborators')
  @GetCollaboratorSwagger()
  async getCollaborators(@Query('repository') repositoryUrl: string) {
    return this.projectService.getRepoCollaborators(repositoryUrl);
  }

  @Public()
  @Get('/readme')
  @GetReadmeSwagger()
  async getReadme(@Query('repository') repositoryUrl: string) {
    return this.projectService.getRepoReadme(repositoryUrl);
  }
}
