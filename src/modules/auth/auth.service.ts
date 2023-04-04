import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Role } from '../roles/enums/roles';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { ResetPasswordDto } from '../user/dto/resetPassword.dto';
import { SignInUserDto } from '../user/dto/signInUser.dto';
import { UserEntity } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { ExpiredAccessTokenEntity } from './models/expiredAccessTokens.entity';
import { RefreshTokenEntity } from './models/refreshTokens.entity';
import { Tokens } from './types/tokens.type';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    @InjectRepository(ExpiredAccessTokenEntity)
    private readonly expiredAccessTokenRepository: Repository<ExpiredAccessTokenEntity>,
    private readonly emailService: EmailService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    await this.usersService.validateEmail(createUserDto.email);
    createUserDto.confirmationToken = uuidv4();
    await this.usersService.create({ ...createUserDto });
    await this.sendConfirmationEmail(
      createUserDto.email,
      createUserDto.confirmationToken,
    );
    return { message: 'Successfully signed up! We sent confirmation email' };
  }

  async sendConfirmationEmail(
    to: string,
    confirmationToken: string,
  ): Promise<any> {
    const CONFIRM_URL =
      process.env.API_URL + '/api/auth/confirmation?confirmation_token=';
    // const emailContent = `Please confirm your account via this link: ${CONFIRM_URL}${confirmationToken}`;
    // const emailDescription = 'Email confirmation';
    const link = `${CONFIRM_URL}${confirmationToken}`;
    await this.emailService.sendContactForm(link, to);
  }

  async confirmEmail(confirmationToken: string) {
    const user = await this.usersService.findByConfirmationToken(
      confirmationToken,
    );
    if (!user)
      throw new HttpException(
        'Invalid confirmation token',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    user.confirmed_at = new Date(Date.now());
    await this.usersService.saveUser(user);
    return '<div>Email successfully confirmed! Now you can sign in.</div>';
  }

  async signIn(userDto: SignInUserDto): Promise<Tokens> {
    const user = await this.validateUser(userDto.email, userDto.password);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async signInAsAdmin(userDto: SignInUserDto): Promise<Tokens> {
    const user = await this.validateAdmin(userDto.email, userDto.password);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const isPasswordsEqual = await this.usersService.isPasswordValid(
      password,
      user,
    );
    if (user && isPasswordsEqual) {
      if (user.confirmed_at) {
        return user;
      }
      throw new ForbiddenException({
        message: 'Confirm your account through your email',
      });
      return user;
    }
    throw new ForbiddenException({
      message: 'Incorrect password or username',
    });
  }

  async validateAdmin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException({
        message: 'This user does not have admin rights',
      });
    }
    const isPasswordsEqual = await this.usersService.isPasswordValid(
      password,
      user,
    );
    if (user && isPasswordsEqual) {
      if (user.confirmed_at) {
        return user;
      }
      throw new ForbiddenException({
        message: 'Confirm your account through your email',
      });
      return user;
    }
    throw new ForbiddenException({
      message: 'Incorrect password or username',
    });
  }

  private async generateTokens(user: UserEntity): Promise<Tokens> {
    const payload = {
      id: user.id,
      email: user.email,
      password: user.password,
      roles: user.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: `.${process.env.NODE_ENV}.${process.env.ACCESS_TOKEN_JWT_SECRET}`,
        expiresIn: process.env.ACCESS_TOKEN_LIFESPAN,
      }),
      this.jwtService.signAsync(payload, {
        secret: `.${process.env.NODE_ENV}.${process.env.REFRESH_TOKEN_JWT_SECRET}`,
        expiresIn: process.env.REFRESH_TOKEN_LIFESPAN,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(user: UserEntity, refreshToken: string) {
    // create new refresh token
    const refreshTokenDb = new RefreshTokenEntity();
    refreshTokenDb.token = refreshToken;
    refreshTokenDb.user = user;
    await this.refreshTokenRepository.save(refreshTokenDb);
  }

  async isAccessTokenExpired(userId: string, token: string): Promise<boolean> {
    const foundToken = await this.expiredAccessTokenRepository.findOne({
      where: { user: { id: userId }, token: token },
    });
    return foundToken !== undefined;
  }

  async refreshAccessToken(userId: string, refreshToken: string) {
    await this.deleteRefreshToken(userId, refreshToken);
    const user = await this.usersService.getOne(userId);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async deleteRefreshToken(userId: string, refreshToken: string) {
    const foundToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: userId }, token: refreshToken },
    });
    // delete old refresh token
    if (foundToken) {
      await this.refreshTokenRepository.remove(foundToken);
    } else {
      throw new ForbiddenException('Access denied!');
    }
  }

  async resetPassword(
    userId: string,
    resetPassword: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.getOne(userId);
    const isMatch = await this.usersService.isPasswordValid(
      resetPassword.oldPassword,
      user,
    );
    if (!isMatch) {
      throw new BadRequestException({
        message: 'Old password does not match!',
      });
    }
    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      throw new BadRequestException({
        message: 'New passwords do not match!',
      });
    }
    await this.usersService.updatePassword(userId, resetPassword.newPassword);
    await this.deleteAllRefreshTokens(userId);
    return {
      message: 'Password updated successfully!',
    };
  }

  async deleteAllRefreshTokens(userId: string) {
    const foundTokens = await this.refreshTokenRepository.find({
      where: { user: { id: userId } },
    });
    await this.refreshTokenRepository.remove(foundTokens);
  }

  async signOut(userId: string, accessToken: string, refreshToken: string) {
    await this.deleteRefreshToken(userId, refreshToken);
    await this.saveExpiredAccessToken(userId, accessToken);
    return { message: 'Successfully logged out!' };
  }

  async fullSignOut(userId: string, accessToken: string) {
    await this.deleteAllRefreshTokens(userId);
    await this.saveExpiredAccessToken(userId, accessToken);
  }

  async saveExpiredAccessToken(userId: string, accessToken: string) {
    const user = await this.usersService.getOne(userId);
    const createdExpiredToken = new ExpiredAccessTokenEntity();
    createdExpiredToken.user = user;
    createdExpiredToken.token = accessToken;
    await this.expiredAccessTokenRepository.save(createdExpiredToken);
  }
}
