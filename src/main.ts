import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initFirebase } from './firebase/firebase.service';

async function bootstrap() {
  await initFirebase();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
