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
import { GetCurrentUserId } from '../auth/decorators/getCurrentUserId.decorator';
import { AdminAuthGuard } from '../auth/guards/adminAuth.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductResponseDto } from './dto/productResponse.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductEntity } from './models/product.entity';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Post('admin/products')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productService.createProduct(createProductDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Put('admin/products/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Get('admin/products')
  async getAllProducts(
    @Query() query: any,
  ): Promise<ProductResponseDto<ProductEntity>> {
    return await this.productService.getAllProductsAdmin(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Get('admin/products/many')
  async getManyProductsByIds(@Query() query: any): Promise<any> {
    return await this.productService.getManyProductsByIds(query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Get('admin/products/:id')
  async getProductById(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productService.getProductById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Delete('admin/products/delete')
  async deleteManyProductsByIds(
    @Body() { ids }: any,
  ): Promise<{ message: string }> {
    return await this.productService.deleteManyProductsByIds(ids);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AdminAuthGuard)
  @Delete('admin/products/:id')
  async deleteProductById(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return await this.productService.deleteProductById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('categories/:slug')
  async getCategoryProducts(@Param('slug') slug: string): Promise<any> {
    return await this.productService.getProducts(slug);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('products/favorites')
  getUsersFavouriteProducts(
    @GetCurrentUserId() userId: string,
  ): Promise<{ products: ProductEntity[] }> {
    return this.productService.getUsersFavouriteProducts(userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('products/favorites/:id')
  addUsersFavouriteProducts(
    @GetCurrentUserId() userId: string,
    @Param('id') productId: string,
  ): Promise<ProductEntity> {
    return this.productService.addUsersFavouriteProducts(userId, productId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('products/favorites/:id')
  removeUsersFavouriteProducts(
    @GetCurrentUserId() userId: string,
    @Param('id') productId: string,
  ): Promise<ProductEntity> {
    return this.productService.removeUsersFavouriteProducts(userId, productId);
  }
}
