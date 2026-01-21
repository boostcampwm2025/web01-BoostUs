import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TechStackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.techStack.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }
}
