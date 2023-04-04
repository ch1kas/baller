import { CategoryEntity } from 'src/modules/category/models/category.entity';
import { ProductEntity } from 'src/modules/product/models/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  original_url: string;

  @OneToOne(() => CategoryEntity, (category) => category.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: CategoryEntity;

  @OneToOne(() => ProductEntity, (product) => product.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: ProductEntity;
}
