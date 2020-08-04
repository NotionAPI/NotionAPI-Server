import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initFirebase } from './firebase/firebase.service';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  await initFirebase();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.enableCors();
  await app.listen(parseInt(process.env.PORT) || 3000, '0.0.0.0');
}

bootstrap();
