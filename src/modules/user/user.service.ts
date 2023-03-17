import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateByRoleUserDto } from './dto/createByRoleUser.dto';
import { PaginationParams } from './dto/paginationParams.dto';
import { PaginationResponseDto } from './dto/pagintationResponse.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers(
    query: PaginationParams,
  ): Promise<PaginationResponseDto<UserEntity>> {
    const [items, count] = await getRepository(UserEntity)
      .createQueryBuilder('users')
      .limit(+query.limit)
      .offset(+query.offset)
      .getManyAndCount();

    return {
      items,
      count,
    };
  }

  async getOne(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ id });
  }

  async deleteMany(ids: string[]): Promise<{ message: string }> {
    await this.userRepository.delete(ids);
    return {
      message: 'Users deleted successfully!',
    };
  }

  async deleteOne(id: string): Promise<{ message: string }> {
    await this.isUserExist(id);
    await this.userRepository.delete(id);
    return {
      message: 'User deleted successfully!',
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.full_name = createUserDto.full_name;
    user.email = createUserDto.email;
    user.password = await this.generateHashPassword(createUserDto.password);
    return await this.userRepository.save(user);
  }

  async createByRole(
    createByRoleUserDto: CreateByRoleUserDto,
  ): Promise<UserEntity> {
    const user = new UserEntity();
    user.full_name = createByRoleUserDto.full_name;
    user.email = createByRoleUserDto.email;
    user.password = await this.generateHashPassword(
      createByRoleUserDto.password,
    );
    user.roles = [createByRoleUserDto.role];
    return await this.userRepository.save(user);
  }

  async generateHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async updatePassword(userId: string, password: string) {
    const hashedNewPassword = await this.generateHashPassword(password);
    await this.userRepository.update(userId, { password: hashedNewPassword });
  }

  async isPasswordValid(password: string, user: UserEntity): Promise<boolean> {
    if (user && user.password) {
      return await bcrypt.compare(password, user.password);
    }
    return false;
  }

  async validateEmail(email: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    if (user) {
      throw new BadRequestException({
        message: 'User with this email already exists. Try another email!',
      });
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }

  async isUserExist(id): Promise<boolean> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new BadRequestException({
        message: 'User with provided id does not exist!',
      });
    }
    return true;
  }
}
