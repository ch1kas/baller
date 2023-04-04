// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { DeleteResult, Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import imagemin, { Result } from 'imagemin';
// import imageminWebp from 'imagemin-webp';
// import Jimp from 'jimp';
// import * as path from 'path';
// import * as fs from 'fs';
// import mv from 'mv';
// import { IFile } from './types/i-file';
// import { IImage } from './types/i-image';
// import { TImageSizes } from './types/t-image-sizes';
// import { ImageEntity } from './models/image.entity';
// import { IMAGE_EXT } from './types/e-image-ext';
// import { FilemanagerService } from './filemanager.service';

// const UPLOAD_FOLDER = 'uploads/images';

// @Injectable()
// export class ImageService {
//   constructor(
//     @InjectRepository(ImageEntity)
//     private readonly imageRepository: Repository<ImageEntity>, // private readonly fileManagerServiice: FilemanagerService,
//   ) {}

//   async saveImage(image: IFile): Promise<ImageEntity> {
//     const imageName = path.parse(image.filename).name;
//     const folder = `${UPLOAD_FOLDER}/${imageName}`;
//     const original_url = `${folder}/${image.filename}`;
//     await this.moveImage(image.path, original_url);
//     const newImage = new ImageEntity();

//     Object.assign(newImage, { original_url, folder });
//     return await this.imageRepository.save(newImage);
//   }

//   async findById(id: number): Promise<ImageEntity> {
//     return this.imageRepository.findOne(id);
//   }

//   async deleteById(id: number): Promise<DeleteResult> {
//     const image = await this.imageRepository.findOne(id);
//     if (!image) {
//       throw new HttpException('Image does not exist', HttpStatus.NOT_FOUND);
//     }

//     await this.removeFolder(image.folder);

//     return await this.imageRepository.delete(id);
//   }

//   async moveImage(imagePath: string, savePath: string) {
//     return new Promise((res) => {
//       mv(imagePath, savePath, { mkdirp: true, clobber: false }, function (err) {
//         if (err) {
//           console.error(err);
//           throw new HttpException(
//             'Failed to load image',
//             HttpStatus.INTERNAL_SERVER_ERROR,
//           );
//         } else {
//           res(true);
//         }
//       });
//     });
//   }

//   async removeFolder(removeFolder: string) {
//     return new Promise((resolve) => {
//       fs.rm(removeFolder, { recursive: true }, (err) => {
//         if (err) {
//           console.error(err);
//         }
//         resolve(true);
//       });
//     });
//   }

//   async removeImageFile(imagePath: string) {
//     return new Promise((res) => {
//       fs.unlinkSync(imagePath);
//       res(true);
//     });
//   }

//   replaceSlash(str: string): string {
//     return str.replace(/\\/g, '/');
//   }

//   replacePath(str: string): string {
//     return str.replace(UPLOAD_FOLDER, 'images');
//   }

//   generateImageName(
//     imageName: string,
//     imageExt: string,
//     imageSize: TImageSizes = 'optimized',
//   ): string {
//     return `${imageName}-${imageSize}${imageExt}`;
//   }

//   async resizeImage(
//     imagePath: string,
//     savePath: string,
//     width: number = Jimp.AUTO,
//     height: number = Jimp.AUTO,
//     quality = 100,
//   ) {
//     if (width === Jimp.AUTO && height === Jimp.AUTO) return;
//     return new Promise((res) => {
//       Jimp.read(imagePath, (err, lenna) => {
//         if (err) throw err;
//         lenna.resize(width, height).quality(quality).write(savePath);
//         res(true);
//       });
//     });
//   }

//   async convertToWebp(
//     imagePath: string,
//     destination: string,
//     quality = 75,
//   ): Promise<Result> {
//     const [res] = await imagemin([imagePath], {
//       destination,
//       plugins: [imageminWebp({ quality })],
//     });
//     return res;
//   }

//   async resizeAndConvert(
//     imagePath: string,
//     imageFolder: string,
//     imageName: string,
//     imageExt: string,
//     size: TImageSizes,
//     width: number = Jimp.AUTO,
//     height: number = Jimp.AUTO,
//   ): Promise<Result> {
//     const iName = this.generateImageName(imageName, imageExt, size);
//     const iPath = `${imageFolder}/${iName}`;
//     await this.resizeImage(imagePath, iPath, width, height);
//     const url = await this.convertToWebp(iPath, imageFolder);
//     await this.removeImageFile(iPath);
//     return url;
//   }

//   //   async uploadImageToS3(id: number) {
//   //     const image = await this.imageRepository.findOne(id);
//   //     if (!image) {
//   //       throw new HttpException(
//   //         'IMAGE WAS NOT FOUND',
//   //         HttpStatus.UNPROCESSABLE_ENTITY,
//   //       );
//   //     }
//   //     if (image.original_url) {
//   //       //   console.log('OG URL -------->', image.original_url);
//   //       await this.fileManagerServiice.getFile(image.original_url);
//   //     }
//   //   }

//   async optimizeImage(imageId: number): Promise<IImage> {
//     const image = await this.findById(imageId);
//     const imageName = path.parse(image.original_url).name;
//     const imageExt = path.parse(image.original_url).ext;
//     const imageFolder = image.folder;

//     const optimizedName = this.generateImageName(imageName, IMAGE_EXT.WEBP);
//     const optimized_url = await this.convertToWebp(
//       image.original_url,
//       imageFolder,
//     );

//     await this.moveImage(
//       optimized_url.destinationPath,
//       `${imageFolder}/${optimizedName}`,
//     );

//     const medium_url = await this.resizeAndConvert(
//       image.original_url,
//       imageFolder,
//       imageName,
//       imageExt,
//       'medium',
//       200,
//     );
//     const small_url = await this.resizeAndConvert(
//       image.original_url,
//       imageFolder,
//       imageName,
//       imageExt,
//       'small',
//       100,
//     );

//     const final_original_url = this.replaceSlash(image.original_url);
//     const final_optimized_url = this.replaceSlash(
//       `${imageFolder}/${optimizedName}`,
//     );
//     const final_medium_url = this.replaceSlash(medium_url.destinationPath);
//     const final_small_url = this.replaceSlash(small_url.destinationPath);

//     const info = {
//       original_url: this.replacePath(final_original_url),
//       optimized_url: this.replacePath(final_optimized_url),
//       medium_url: this.replacePath(final_medium_url),
//       small_url: this.replacePath(final_small_url),
//     };

//     Object.assign(image, info);
//     return await this.imageRepository.save(image);
//   }
// }
