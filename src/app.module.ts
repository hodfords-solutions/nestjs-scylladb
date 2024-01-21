import { Module } from '@nestjs/common';
import { ScyllaModule } from 'libs';
import { CatsModule } from './cats';
import { scyllaOptions } from './config';

@Module({
    imports: [ScyllaModule.forRoot(scyllaOptions), CatsModule]
})
export class AppModule {}
