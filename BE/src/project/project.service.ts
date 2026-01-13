import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectListQueryDto } from './dto/project-list-query.dto';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async findAll(query: ProjectListQueryDto) {
    const where = query.cohort ? { cohort: query.cohort } : undefined;
    return this.projectRepository.findAll(where);
  }

  async findOne(id: number) {
    const projectId = BigInt(id);

    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    }

    return project;
  }

  // async create(dto: CreateProjectDto) {
  //   // 프로젝트 등록자 memberId는 인증 사용자에서 주입해야 함 -> 커스텀 데코레이터?
  //   const memberId = BigInt(1); // 임시 값

  //   return this.projectRepository.create(memberId, dto);
  // }

  // async update(id: number, dto: UpdateProjectDto) {
  //   const projectId = BigInt(id);

  //   const exists = await this.projectRepository.exists(projectId);
  //   if (!exists) {
  //     throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
  //   }

  //   return this.projectRepository.update(projectId, dto);
  // }

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
