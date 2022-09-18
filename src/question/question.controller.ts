import { Controller, Get, Param } from '@nestjs/common';
import { BaseContriller } from 'src/base.controller';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, questionParam } from './entities/question.entity';
@Controller('question')
export class QuestionController extends BaseContriller<Question, CreateQuestionDto, UpdateQuestionDto> {
  constructor(private readonly questionService: QuestionService) {
    super(questionService, questionParam);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id,['options'],(options) => {
      // options.order = {
      //   options: {
      //     sort: 'ASC'
      //   }
      // };
      return options;
    });
  }
}