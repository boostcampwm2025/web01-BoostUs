import { Injectable } from '@nestjs/common';
import { LandingRepository } from './landing.repository';

@Injectable()
export class LandingService {
  constructor(private readonly landingRepo: LandingRepository) {}

  async findAll() {
    return this.landingRepo.getCnt();
  }
}
