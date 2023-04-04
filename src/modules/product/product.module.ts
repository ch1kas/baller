import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/models/category.entity';
import { UserEntity } from '../user/models/user.entity';
import { ProductController } from './product.controller';
import { ProductEntity } from './models/product.entity';
import { ProductService } from './product.service';
import { ImageEntity } from '../filemanager/models/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      CategoryEntity,
      UserEntity,
      ImageEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
