import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { ConnectionOptions } from './externals';

export type ScyllaModuleOptions = {
    retryAttempts?: number;

    retryDelay?: number;

    keepConnectionAlive?: boolean;
} & Partial<ConnectionOptions>;

export interface ScyllaOptionsFactory {
    createScyllaOptions(): Promise<ScyllaModuleOptions> | ScyllaModuleOptions;
}

export interface ScyllaModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;

    useExisting?: Type<ScyllaOptionsFactory>;

    useClass?: Type<ScyllaOptionsFactory>;

    useFactory?: (...args: any[]) => Promise<ScyllaModuleOptions> | ScyllaModuleOptions;

    inject?: any[];
}
