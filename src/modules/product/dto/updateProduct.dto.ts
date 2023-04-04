import { CategoryEntity } from 'src/modules/category/models/category.entity';
import { ImageEntity } from 'src/modules/filemanager/models/image.entity';

export class UpdateProductDto {
  name?: string;

  description?: string;

  price?: number;

  quantity?: number;

  numeric_size?: number;

  letter_size?: string;

  categories?: CategoryEntity[];

  image?: ImageEntity;
}
