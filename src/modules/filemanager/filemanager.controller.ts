import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/public.decorator';
import { IFile } from './types/i-file';
import { imageFileInterceptorOptions } from './interceptors/image.fileInterceptor';
import { imagePipe } from './pipes/image.pipe';
import { FilemanagerService } from './filemanager.service';
import { Observable, of } from 'rxjs';
import path from 'path';
import { AdminAuthGuard } from '../auth/guards/adminAuth.guard';

@Controller('filemanager')
export class FilemanagerController {
  constructor(public service: FilemanagerService) {}

  @Post('/image')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageFileInterceptorOptions))
  async uploadImage(
    @UploadedFile(imagePipe)
    file: IFile,
  ): Promise<any> {
    return await this.service.saveWithoutOptimization(file);
  }

  @Delete('/image/:id')
  async deleteImage(@Param('id') id: number) {
    return await this.service.deleteImage(id);
  }

  // @Get('images/:folder/:imagename')
  // findImage(
  //   @Param('folder') folder,
  //   @Param('imagename') imagename,
  //   @Res() res,
  // ): Observable<File> {
  //   return of(
  //     res.sendFile(
  //       path.join(process.cwd(), `uploads/images/${folder}/${imagename}`),
  //     ),
  //   );
  // }
}
