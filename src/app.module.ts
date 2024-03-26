import { Module } from '@nestjs/common';
import { ScyllaModule } from 'libs';
import { CatModule } from './cats';
import { scyllaOptions } from './config';

@Module({
    imports: [ScyllaModule.forRoot(scyllaOptions), CatModule]
})
export class AppModule {}
