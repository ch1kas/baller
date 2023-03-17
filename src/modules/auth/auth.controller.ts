import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { ResetPasswordDto } from '../user/dto/resetPassword.dto';
import { SignInUserDto } from '../user/dto/signInUser.dto';
import { UserEntity } from '../user/user.entity';
import { AuthService } from './auth.service';
import { GetCurrentUser } from './decorators/getCurrentUser.decorator';
import { GetCurrentUserId } from './decorators/getCurrentUserId.decorator';
import { Public } from './decorators/public.decorator';
import { RefreshTokenAuthGuard } from './guards/refreshTokenAuth.guard';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('/sign-in')
  async signIn(@Body() signInUserDto: SignInUserDto): Promise<Tokens> {
    return await this.authService.signIn(signInUserDto);
  }

  @Public()
  @Post('/admin/signIn')
  signInAsAdmin(@Body() userDto: SignInUserDto): Promise<Tokens> {
    return this.authService.signInAsAdmin(userDto);
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @Post('/refresh')
  refreshAccessToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshAccessToken(userId, refreshToken);
  }

  @Post('/resetPassword')
  resetPassword(
    @GetCurrentUserId() userId: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(userId, resetPasswordDto);
  }

  @Post('/sign-out')
  signOut(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('accessToken') accessToken: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.signOut(userId, accessToken, refreshToken);
  }

  @Post('/full-sign-out')
  fullSignOut(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('accessToken') accessToken: string,
  ) {
    return this.authService.fullSignOut(userId, accessToken);
  }
}
