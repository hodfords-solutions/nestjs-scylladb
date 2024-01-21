import { Module } from '@nestjs/common';
import { ScyllaModule } from 'libs';
import { CatsController } from './cat.controller';
import { CatRepository } from './cat.repository';
import { CatsService } from './cat.service';
import { DogController } from './dog.controller';
import { CatEntity } from './entities/cat.entity';
import { DogEntity } from './entities/dog.entity';

@Module({
    imports: [ScyllaModule.forFeature([CatEntity, DogEntity, CatRepository])],
    controllers: [CatsController, DogController],
    providers: [CatsService]
})
export class CatsModule {}
