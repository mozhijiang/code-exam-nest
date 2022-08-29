import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, questionParam } from './entities/question.entity';

@Injectable()
export class QuestionService extends BaseService<Question, CreateQuestionDto, UpdateQuestionDto > {
  constructor(@InjectRepository(Question) public readonly repository: Repository <Question>) {
    super(repository, questionParam);
  }
}