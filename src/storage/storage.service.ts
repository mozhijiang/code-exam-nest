import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { Repository } from 'typeorm';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { Storage, storageParam } from './entities/storage.entity';

@Injectable()
export class StorageService extends BaseService <Storage, CreateStorageDto, UpdateStorageDto > {
  constructor(@InjectRepository(Storage) public readonly repository: Repository <Storage>) {
    super(repository, storageParam);
  }
}