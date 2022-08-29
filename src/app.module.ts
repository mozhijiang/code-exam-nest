import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from 'env';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { StorageModule } from './storage/storage.module';
import { TagModule } from './tag/tag.module';
import { QuestionModule } from './question/question.module';
import { OptionModule } from './option/option.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(Env.database),
    BookModule,
    StorageModule,
    TagModule,
    QuestionModule,
    OptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
