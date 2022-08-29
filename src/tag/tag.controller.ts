import { Controller } from '@nestjs/common';
import { BaseContriller } from 'src/base.controller';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, tagParam } from './entities/tag.entity';
@Controller('tag')
export class TagController extends BaseContriller<Tag, CreateTagDto, UpdateTagDto> {
  constructor(tagService: TagService) {
    super(tagService, tagParam);
  }
}