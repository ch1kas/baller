import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ImageEntity } from './models/image.entity';
import { IImage } from './types/i-image';
import { IFile } from './types/i-file';
import fs, { readFileSync } from 'fs';
import mv from 'mv';
import { FileUploadService } from './fileUpload.service';

@Injectable()
export class FilemanagerService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async saveWithoutOptimization(originalFile: IFile): Promise<any> {
    const { destination, filename, mimetype } = originalFile;
    const imagePath = `${destination}/${filename}`;
    const file = readFileSync(imagePath);

    const loadedOriginalFile: any = await this.fileUploadService.upload(
      file,
      filename,
      mimetype,
    );

    const image = new ImageEntity();
    image.original_url = loadedOriginalFile.Location;
    const result = await this.imageRepository.save(image);
    console.log(result);
    return result;
  }

  async deleteImage(id: number): Promise<string> {
    await this.imageRepository.delete({ id });
    return 'Image deleted';
  }
}
