import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { getRepository, Repository } from 'typeorm';
import { CategoryEntity } from '../category/models/category.entity';
import { ImageEntity } from '../filemanager/models/image.entity';
import { UserEntity } from '../user/models/user.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductResponseDto } from './dto/productResponse.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductEntity } from './models/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const product = new ProductEntity();
    Object.assign(product, createProductDto);
    product.slug = this.getSlug(createProductDto.name);
    const categories = [];
    createProductDto.categories.map((category) => {
      categories.push({ id: category });
    });
    product.categories = categories;
    return this.productRepository.save(product);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    await this.isProductExist(id);

    const product = await this.productRepository.findOne(id);
    if (updateProductDto.image && product.image) {
      await this.imageRepository.remove(product.image);
    }

    Object.assign(product, updateProductDto);
    if (updateProductDto.categories) {
      const categories = [];
      updateProductDto.categories.map((category) => {
        categories.push({ id: category });
      });
      product.categories = categories;
    }
    console.log(product);

    return await this.productRepository.save(product);
  }

  async getAllProductsAdmin(
    query: any,
  ): Promise<ProductResponseDto<ProductEntity>> {
    const queryBuilder =
      getRepository(ProductEntity).createQueryBuilder('products');
    queryBuilder
      .leftJoinAndSelect('products.image', 'image')
      .leftJoinAndSelect('products.categories', 'category');
    if (query.limit) {
      queryBuilder.limit(+query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(+query.offset);
    }
    const [items, count] = await queryBuilder.getManyAndCount();
    return {
      items,
      count,
    };
  }

  async getProducts(slug: string): Promise<any> {
    return await getRepository(CategoryEntity)
      .createQueryBuilder('categories')
      .leftJoinAndSelect('categories.products', 'products')
      .leftJoinAndSelect('products.image', 'image')
      .where('categories.slug = :slug', { slug: slug })
      .getMany();
  }

  async getManyProductsByIds(query): Promise<any> {
    return await getRepository(ProductEntity)
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.image', 'image')
      .where('products.id IN (:...ids)', {
        ids: query.filter,
      })
      .getMany();
  }

  async getProductById(id: string): Promise<ProductEntity> {
    return await this.productRepository.findOne(id, {
      relations: ['categories', 'image'],
    });
  }

  async deleteManyProductsByIds(ids: string[]): Promise<{ message: string }> {
    await this.productRepository.delete(ids);
    return {
      message: 'Products deleted successfully!',
    };
  }

  async deleteProductById(id: string): Promise<{ message: string }> {
    await this.isProductExist(id);
    await this.productRepository.delete(id);
    return { message: 'Product deleted successfully' };
  }

  async getUsersFavouriteProducts(
    userId: string,
  ): Promise<{ products: ProductEntity[] }> {
    const usersFavouriteProducts = await this.userRepository.findOne(userId, {
      relations: ['favorites', 'favorites.categories'],
    });

    return {
      products: usersFavouriteProducts.favorites,
    };
  }

  async addUsersFavouriteProducts(
    userId: string,
    productId: string,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findOne(productId);
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });

    const isNotFavourited =
      user.favorites.findIndex(
        (productInFavourites) => productInFavourites.id === product.id,
      ) === -1;
    if (isNotFavourited) {
      user.favorites.push(product);

      await this.userRepository.save(user);
    }
    return product;
  }

  async removeUsersFavouriteProducts(
    userId: string,
    productId: string,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findOne(productId);
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });

    const postIndex = user.favorites.findIndex(
      (productInFavourites) => productInFavourites.id === product.id,
    );
    if (postIndex >= 0) {
      user.favorites.splice(postIndex, 1);
      await this.userRepository.save(user);
    }
    return product;
  }

  async isProductExist(id: string): Promise<boolean> {
    const product = this.productRepository.findOne({ id });
    if (!product) {
      throw new BadRequestException({
        message: 'Product with provided id does not exist!',
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
