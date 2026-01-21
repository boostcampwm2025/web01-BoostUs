import { PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './req/create-answer.dto';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {}
