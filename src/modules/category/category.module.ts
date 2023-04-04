import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './models/category.entity';
import { CategoryService } from './category.service';
import { ImageEntity } from '../filemanager/models/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ImageEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
