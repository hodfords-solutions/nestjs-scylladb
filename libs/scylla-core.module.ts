import { DynamicModule, Module, Global, Provider, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { SCYLLA_DB_MODULE_OPTIONS, SCYLLA_DB_MODULE_ID } from './scylla.constant';
import { getConnectionToken, handleRetry, generateString } from './utils/scylla.utils';
import { defer } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    ScyllaModuleAsyncOptions,
    ScyllaModuleOptions,
    ScyllaOptionsFactory
} from './interfaces/scylla-module-options.interface';
import { ConnectionOptions } from './interfaces/externals/scylla-client-options.interface';
import { Connection } from './interfaces/externals/scylla-connection.interface';

@Global()
@Module({})
export class ScyllaCoreModule implements OnModuleDestroy {
    constructor(
        @Inject(SCYLLA_DB_MODULE_OPTIONS)
        private readonly options: ScyllaModuleOptions,
        private readonly moduleRef: ModuleRef
    ) {}

    static forRoot(options: ScyllaModuleOptions = {}): DynamicModule {
        const expressModuleOptions = {
            provide: SCYLLA_DB_MODULE_OPTIONS,
            useValue: options
        };
        const connectionProvider = {
            provide: getConnectionToken(options as ConnectionOptions),
            useFactory: async () => await this.createConnectionFactory(options)
        };
        return {
            module: ScyllaCoreModule,
            providers: [expressModuleOptions, connectionProvider],
            exports: [connectionProvider]
        };
    }

    static forRootAsync(options: ScyllaModuleAsyncOptions): DynamicModule {
        const connectionProvider = {
            provide: getConnectionToken(options as ConnectionOptions),
            useFactory: async (ormOptions: ScyllaModuleOptions) => {
                if (options.name) {
                    return await this.createConnectionFactory({
                        ...ormOptions,
                        name: options.name
                    });
                }
                return await this.createConnectionFactory(ormOptions);
            },
            inject: [SCYLLA_DB_MODULE_OPTIONS]
        };

        const asyncProviders = this.createAsyncProviders(options);
        return {
            module: ScyllaCoreModule,
            imports: options.imports,
            providers: [
                ...asyncProviders,
                connectionProvider,
                {
                    provide: SCYLLA_DB_MODULE_ID,
                    useValue: generateString()
                }
            ],
            exports: [connectionProvider]
        };
    }

    async onModuleDestroy() {
        if (this.options.keepConnectionAlive) {
            return;
        }
        Logger.log('Closing connection', 'ScyllaModule');
        const connection = this.moduleRef.get<Connection>(getConnectionToken(this.options as ConnectionOptions) as any);
        connection && (await connection.closeAsync());
    }

    private static createAsyncProviders(options: ScyllaModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }

    private static createAsyncOptionsProvider(options: ScyllaModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: SCYLLA_DB_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: SCYLLA_DB_MODULE_OPTIONS,
            useFactory: async (optionsFactory: ScyllaOptionsFactory) => await optionsFactory.createScyllaOptions(),
            inject: [options.useClass || options.useExisting]
        };
    }

    private static async createConnectionFactory(options: ScyllaModuleOptions): Promise<Connection> {
        const { retryAttempts, retryDelay, ...scyllaOptions } = options;
        const connection = new Connection(scyllaOptions);

        return await defer(() => connection.initAsync())
            .pipe(
                handleRetry(retryAttempts, retryDelay),
                map(() => connection)
            )
            .toPromise();
    }
}
