import { DynamicModule, Module } from '@nestjs/common';
import { ScyllaCoreModule } from './scylla-core.module';
import { ScyllaModuleOptions, ScyllaModuleAsyncOptions, Connection, ConnectionOptions } from './interfaces';
import { createScyllaProviders } from './scylla.providers';

@Module({})
export class ScyllaModule {
    static forRoot(options: ScyllaModuleOptions): DynamicModule {
        return {
            module: ScyllaModule,
            imports: [ScyllaCoreModule.forRoot(options)]
        };
    }

    static forFeature(
        entities: Function[] = [],
        connection: Connection | ConnectionOptions | string = 'default'
    ): DynamicModule {
        const providers = createScyllaProviders(entities, connection);
        return {
            module: ScyllaModule,
            providers,
            exports: providers
        };
    }

    static forRootAsync(options: ScyllaModuleAsyncOptions): DynamicModule {
        return {
            module: ScyllaModule,
            imports: [ScyllaCoreModule.forRootAsync(options)]
        };
    }
}
