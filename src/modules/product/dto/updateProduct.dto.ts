import { CategoryEntity } from 'src/modules/category/category.entity';

export class UpdateProductDto {
  name?: string;

  description?: string;

  price?: number;

  quantity?: number;

  numeric_size?: number;

  letter_size?: string;

  categories?: CategoryEntity[];
}
