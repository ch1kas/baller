import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { getRepository, Repository } from 'typeorm';
import { PaginationParams } from '../user/dto/paginationParams.dto';
import { CategoryEntity } from './category.entity';
import { CategoriesResponseDto } from './dto/categoryResponse.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = new CategoryEntity();
    category.slug = this.getSlug(createCategoryDto.name);
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    return this.categoryRepository.save(category);
  }

  async getCategories(
    query: PaginationParams,
  ): Promise<CategoriesResponseDto<CategoryEntity>> {
    const queryBuilder =
      getRepository(CategoryEntity).createQueryBuilder('categories');

    if (query.limit) {
      queryBuilder.limit(+query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(+query.offset);
    }
    const data = await queryBuilder.getManyAndCount();

    return {
      items: data[0],
      count: data[1],
    };
  }

  async getCategoryById(id: string): Promise<CategoryEntity> {
    return await getRepository(CategoryEntity)
      .createQueryBuilder('categories')
      .where('categories.id = :id', {
        id: id,
      })
      .getOne();
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    await this.isCategoryExist(id);
    if (updateCategoryDto.name) {
      updateCategoryDto.slug = this.getSlug(updateCategoryDto.name);
    }
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.categoryRepository.findOne({ id });
  }

  async deleteCategoryById(id: string): Promise<{ message: string }> {
    await this.isCategoryExist(id);
    await this.categoryRepository.delete(id);
    return {
      message: 'Categories deleted successfully!',
    };
  }

  async getManyCategoriesByIds(ids): Promise<any> {
    return await getRepository(CategoryEntity)
      .createQueryBuilder('categories')
      .where('categories.id IN (:...ids)', {
        ids: ids,
      })
      .getMany();
  }

  async deleteManyCategoriesByIds(ids: string[]): Promise<{ message: string }> {
    await this.categoryRepository.delete(ids);
    return {
      message: 'Categories deleted successfully!',
    };
  }

  async isCategoryExist(id: string): Promise<boolean> {
    const category = this.categoryRepository.findOne({ id });
    if (!category) {
      throw new BadRequestException({
        message: 'Category with provided id does not exist!',
      });
    }
    return true;
  }

  private getSlug(name: string): string {
    return slugify(name.normalize('NFC'), {
      lower: true,
      strict: true,
      remove: /[*+~.()`'/"\\!:@]/g,
    });
  }
}
