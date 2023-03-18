import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const API_DEFAULT_PREFIX = '/api';

  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix(API_DEFAULT_PREFIX);

  await app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
}
bootstrap();
