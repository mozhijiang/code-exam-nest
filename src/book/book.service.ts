import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, bookParam } from './entities/book.entity';

@Injectable()
export class BookService extends BaseService<Book, CreateBookDto, UpdateBookDto>{
  constructor(
    @InjectRepository(Book) public readonly repository: Repository<Book>,
  ) {
    super(repository, bookParam);
  };
}
