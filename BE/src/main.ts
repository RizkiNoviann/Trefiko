import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

const imageDir = process.env.VERCEL === '1' ? '/tmp/image' : join(process.cwd(), 'src', 'image');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (!existsSync(imageDir)) {
    mkdirSync(imageDir, { recursive: true });
  }

  app.useStaticAssets(imageDir, { prefix: '/images/' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
