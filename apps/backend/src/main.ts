import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

export const useMockServices = process.env.USE_MOCK_SERVICES === 'true';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://fight-club-nqfh.onrender.com'],
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  console.log(`🛠️  Using mock services: ${useMockServices ? 'YES' : 'NO'}`);

  await app.listen(process.env.PORT ?? 8008);
  console.log('🚀 Server is running on http://localhost:8008');
}

void bootstrap();
