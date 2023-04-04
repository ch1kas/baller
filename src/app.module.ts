import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenAuthGuard } from './modules/auth/guards/accessTokenAuth.guard';
import { EmailModule } from './modules/email/email.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { FilemanagerModule } from './modules/filemanager/filemanager.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    EmailModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    FilemanagerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useExisting: AccessTokenAuthGuard },
    { provide: APP_PIPE, useExisting: ValidationPipe },
    AccessTokenAuthGuard,
    ValidationPipe,
  ],
})
export class AppModule {}
