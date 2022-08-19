import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from 'env';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(Env.database)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
