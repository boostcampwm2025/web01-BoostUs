import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecommendRepository } from './recommend.repository';
import { ProjectRecommendDto } from './dto/recomment-item.dto';

@Injectable()
export class RecommendService {
  constructor(private readonly recommendRepository: RecommendRepository) {}

  async getRecommend(): Promise<ProjectRecommendDto[]> {
    const projects = await this.recommendRepository.getRecommend();

    const picked =
      projects.length <= 3
        ? projects
        : this.shuffle(projects, this.createSeededRandom(this.getTodaySeed())).slice(0, 3);

    return plainToInstance(ProjectRecommendDto, picked, {
      excludeExtraneousValues: true,
    });
  }

  private getTodaySeed(): number {
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash << 5) - hash + today.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  private createSeededRandom(seed: number): () => number {
    let t = seed;
    return () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), t | 1);
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  private shuffle<T>(array: T[], random: () => number): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
