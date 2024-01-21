import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: true });
    await app.listen(3000);
}
bootstrap()
    .then(() => console.log('Init app success'))
    .catch(console.error);
