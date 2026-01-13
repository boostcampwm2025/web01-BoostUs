import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: bigint) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteById(id: bigint) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async exists(id: bigint) {
    const count = await this.prisma.project.count({
      where: { id },
    });
    return count > 0;
  }
}
