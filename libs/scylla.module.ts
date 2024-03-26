import { DynamicModule, Module } from '@nestjs/common';
import { ScyllaCoreModule } from './scylla-core.module';
import { createScyllaProviders } from './scylla.providers';
import { ScyllaModuleAsyncOptions, ScyllaModuleOptions } from './interfaces/scylla-module-options.interface';
import { Connection } from './interfaces/externals/scylla-connection.interface';
import { ConnectionOptions } from './interfaces/externals/scylla-client-options.interface';

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
