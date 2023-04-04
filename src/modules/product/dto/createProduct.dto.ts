import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { CategoryEntity } from 'src/modules/category/models/category.entity';
import { ImageEntity } from 'src/modules/filemanager/models/image.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  numeric_size?: number;

  letter_size?: string;

  categories?: CategoryEntity[];

  image?: ImageEntity;
}
