import { Controller } from '@nestjs/common';
import { BaseContriller } from 'src/base.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Controller('book')
export class BookController extends BaseContriller<Book, CreateBookDto, UpdateBookDto>  {
  constructor(bookService: BookService) {
    super(bookService);
  }
}
