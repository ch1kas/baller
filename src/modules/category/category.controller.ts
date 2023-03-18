import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { AdminAuthGuard } from '../auth/guards/adminAuth.guard';
import { PaginationParams } from '../user/dto/paginationParams.dto';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import { CategoriesResponseDto } from './dto/categoryResponse.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get('categories')
  async getCategories(
    @Query() query: PaginationParams,
  ): Promise<CategoriesResponseDto<CategoryEntity>> {
    return await this.categoriesService.getCategories(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Post('admin/categories/')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Get('admin/categories/many')
  GetManyCategoriesByIds(@Body() { ids }: any): Promise<any> {
    return this.categoriesService.getManyCategoriesByIds(ids);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Get('admin/categories')
  async getCategoriesAdmin(
    @Query() query: PaginationParams,
  ): Promise<CategoriesResponseDto<CategoryEntity>> {
    return await this.categoriesService.getCategories(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Get('admin/categories/:id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryEntity> {
    return await this.categoriesService.getCategoryById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Put('admin/categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Delete('admin/categories/:id')
  async deleteCategoryById(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return await this.categoriesService.deleteCategoryById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Delete('admin/categories')
  deleteManyCategoriesByIds(
    @Body() { ids }: any,
  ): Promise<{ message: string }> {
    return this.categoriesService.deleteManyCategoriesByIds(ids);
  }
}
