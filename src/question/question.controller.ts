import { Controller } from '@nestjs/common';
import { BaseContriller } from 'src/base.controller';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, questionParam } from './entities/question.entity';
@Controller('question')
export class QuestionController extends BaseContriller<Question, CreateQuestionDto, UpdateQuestionDto> {
  constructor(questionService: QuestionService) {
    super(questionService, questionParam);
  }
}