import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TechStackItemDto } from './dto/tech-stack-item.dto';
import { TechStackRepository } from './tech-stack.repository';

@Injectable()
export class TechStackService {
  constructor(private readonly techStackRepository: TechStackRepository) {}

  async findAll() {
    const techStacks = await this.techStackRepository.findAll();

    const items = plainToInstance(TechStackItemDto, techStacks, {
      excludeExtraneousValues: true,
    });

    // 카테고리별로 그룹화
    const groupedByCategory = items.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push({
          id: item.id,
          name: item.name,
        });
        return acc;
      },
      {} as Record<string, Array<{ id: number; name: string }>>,
    );

    return groupedByCategory;
  }
}
