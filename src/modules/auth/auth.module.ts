import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenEntity } from './models/refreshTokens.entity';
import { ExpiredAccessTokenEntity } from './models/expiredAccessTokens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({
      session: false,
    }),
    UserModule,
    EmailModule,
    TypeOrmModule.forFeature([RefreshTokenEntity, ExpiredAccessTokenEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
