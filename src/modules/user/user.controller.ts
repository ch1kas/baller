import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUserId } from '../auth/decorators/getCurrentUserId.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { PaginationParams } from './dto/paginationParams.dto';
import { PaginationResponseDto } from './dto/pagintationResponse.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/users')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUsers(
    @Query() query: PaginationParams,
  ): Promise<PaginationResponseDto<UserEntity>> {
    return await this.userService.getUsers(query);
  }

  @Get('users/current')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCurrentUser(
    @GetCurrentUserId() userId: string,
  ): Promise<UserEntity> {
    return await this.userService.getOne(userId);
  }

  @Get('admin/users/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserById(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.getOne(id);
  }

  @Delete('admin/users/delete')
  @UseInterceptors(ClassSerializerInterceptor)
  async deletManyUsers(@Body() { ids }: any): Promise<{ message: string }> {
    return await this.userService.deleteMany(ids);
  }

  @Delete('admin/users/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteUserById(@Param('id') id: string): Promise<{ message: string }> {
    return await this.userService.deleteOne(id);
  }

  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  async createUser(@Body() userDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(userDto);
  }
}
