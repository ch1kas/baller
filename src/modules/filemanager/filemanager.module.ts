import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilemanagerController } from './filemanager.controller';
import { FilemanagerService } from './filemanager.service';
import { FileUploadService } from './fileUpload.service';
import { ImageEntity } from './models/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [FilemanagerController],
  providers: [FilemanagerService, FileUploadService],
  exports: [FilemanagerService, FileUploadService],
})
export class FilemanagerModule {}
