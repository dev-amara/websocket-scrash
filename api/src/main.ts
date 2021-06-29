import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5002);
}
bootstrap().then(() => console.log('Server API start on http://localhost:5002'));
