import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, tagParam } from './entities/tag.entity';

@Injectable()
export class TagService extends BaseService<Tag, CreateTagDto, UpdateTagDto > {
  constructor(@InjectRepository(Tag) public readonly repository: Repository <Tag>) {
    super(repository, tagParam);
  }
}