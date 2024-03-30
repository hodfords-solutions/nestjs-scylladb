import { getModelToken, getConnectionToken, getRepositoryToken } from './utils/scylla.utils';
import { defer, lastValueFrom } from 'rxjs';
import { getEntity } from './utils/decorator.utils';
import { Provider } from '@nestjs/common';
import { RepositoryFactory } from './repositories/repository.factory';
import { Repository } from './repositories/repository';
import { loadModel } from './utils/model.utils';
import { Connection } from './interfaces/externals/scylla-connection.interface';
import { ConnectionOptions } from './interfaces/externals/scylla-client-options.interface';

export function createScyllaProviders(entities?: Function[], connection?: Connection | ConnectionOptions | string) {
    const providerModel = (entity) => ({
        provide: getModelToken(entity),
        useFactory: async (connectionLike: Connection) => {
            return await lastValueFrom(defer(() => loadModel(connectionLike, entity)));
        },
        inject: [getConnectionToken(connection)]
    });

    const provideRepository = (entity) => ({
        provide: getRepositoryToken(entity),
        useFactory: async (model) => RepositoryFactory.create(entity, model),
        inject: [getModelToken(entity)]
    });

    const provideCustomRepository = (entityRepository) => {
        const entity = getEntity(entityRepository);

        return {
            provide: getRepositoryToken(entityRepository),
            useFactory: async (model) => RepositoryFactory.create(entity, model, entityRepository),
            inject: [getModelToken(entity)]
        };
    };

    const providers: Provider[] = [];
    (entities || []).forEach((entity) => {
        if (entity.prototype instanceof Repository) {
            return providers.push(provideCustomRepository(entity));
        }
        return providers.push(providerModel(entity), provideRepository(entity));
    });

    return [...providers];
}
