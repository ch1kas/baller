import { ImageEntity } from 'src/modules/filemanager/models/image.entity';

export class UpdateCategoryDto {
  slug?: string;

  name?: string;

  description?: string;

  image?: ImageEntity;
}
