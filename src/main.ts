import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('code-exam-nest')
    .setDescription('code-exam-nest')
    .setVersion('1.0')
    .addTag('code-exam-nest')
    .build();
  const rootDir = join(__dirname, '../../');
  app.use('/public', express.static(join(rootDir, 'public')));
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('document', app, document);
  await app.listen(3000);
}
bootstrap();
