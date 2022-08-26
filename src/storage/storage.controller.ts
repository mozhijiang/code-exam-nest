import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BaseContriller } from 'src/base.controller';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Storage } from './entities/storage.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createHash } from 'crypto';
@Controller('storage')
export class StorageController extends BaseContriller<Storage, CreateStorageDto, UpdateStorageDto> {
  constructor(public storageService: StorageService) {
    super(storageService);
  }
  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async UploadedFile(@UploadedFiles() file: Express.Multer.File) {
    const storage = new Storage();
    storage.name = file.filename;
    storage.originalName = file.originalname;
    storage.mime = file.mimetype;
    storage.path = file.path;
    storage.hash = createHash('md5').update(file.path).digest('hex');
    storage.time = new Date();
    return this.storageService.save(storage);
  }
}