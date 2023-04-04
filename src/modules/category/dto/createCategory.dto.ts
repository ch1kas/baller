import { IsNotEmpty, IsString } from 'class-validator';
import { ImageEntity } from 'src/modules/filemanager/models/image.entity';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  description?: string;

  image?: ImageEntity;
}
