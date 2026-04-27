import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Nonvoyxona API')
    .setDescription('Nonvoyxona boshqaruv tizimi API dokumentatsiyasi')
    .setVersion('1.0')
    .addTag('dashboard')
    .addTag('production')
    .addTag('sales')
    .addTag('points')
    .addTag('finance')
    .addTag('hr')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log('🍞 Nonvoyxona server ishga tushdi: http://localhost:3001');
  console.log('📚 API Docs: http://localhost:3001/api/docs');
}
bootstrap();
