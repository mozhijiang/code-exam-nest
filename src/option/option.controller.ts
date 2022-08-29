import { Controller } from '@nestjs/common';
import { BaseContriller } from 'src/base.controller';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option, optionParam } from './entities/option.entity';
@Controller('option')
export class OptionController extends BaseContriller<Option, CreateOptionDto, UpdateOptionDto> {
  constructor(optionService: OptionService) {
    super(optionService, optionParam);
  }
}