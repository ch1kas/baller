import { ImageEntity } from 'src/modules/filemanager/models/image.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ProductEntity } from '../../product/models/product.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 0 })
  product_count: number;

  @ManyToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[];

  @OneToOne(() => ImageEntity, (image) => image.category, {
    eager: true,
  })
  image: ImageEntity;
}
