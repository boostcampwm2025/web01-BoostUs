import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectQueryDto } from './dto/get-project.query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor() {}

  async findAll(query: GetProjectQueryDto) {}

  async findOne(id: number) {}

  async create(dto: CreateProjectDto) {}

  async update(id: number, dto: UpdateProjectDto) {}

  async remove(id: number) {}
}
