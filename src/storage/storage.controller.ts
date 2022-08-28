import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BaseContriller } from 'src/base.controller';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Storage, storageParam } from './entities/storage.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createHash } from 'crypto';
@Controller('storage')
export class StorageController extends BaseContriller<Storage, CreateStorageDto, UpdateStorageDto> {
  constructor(public storageService: StorageService) {
    super(storageService, storageParam);
  }
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async UploadedFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const savePromise = files.map(file => {
      const storage = new Storage();
      storage.name = file.filename;
      storage.originalName = file.originalname;
      storage.mime = file.mimetype;
      storage.path = file.path.replaceAll('\\','/');
      storage.hash = createHash('md5').update(file.path).digest('hex');
      storage.time = new Date();
      return this.storageService.save(storage);
    })
    return Promise.all(savePromise);
  }
}