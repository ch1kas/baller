import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CategoryEntity } from '../category/category.entity';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ nullable: true })
  numeric_size: number;

  @Column({ nullable: true })
  letter_size: string;

  @ManyToMany(() => CategoryEntity, (category) => category.products)
  @JoinTable()
  categories: CategoryEntity[];
}