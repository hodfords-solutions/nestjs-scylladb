import { Module } from '@nestjs/common';
import { ScyllaModule } from 'libs';
import { CatsController } from './cat.controller';
import { CatRepository } from './cat.repository';
import { CatsService } from './cat.service';
import { CatEntity } from './entities/cat.entity';

@Module({
    imports: [ScyllaModule.forFeature([CatEntity, CatRepository])],
    controllers: [CatsController],
    providers: [CatsService]
})
export class CatModule {}
