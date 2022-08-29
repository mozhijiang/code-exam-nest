import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { Repository } from 'typeorm';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option, optionParam } from './entities/option.entity';

@Injectable()
export class OptionService extends BaseService<Option, CreateOptionDto, UpdateOptionDto > {
  constructor(@InjectRepository(Option) public readonly repository: Repository <Option>) {
    super(repository, optionParam);
  }
}