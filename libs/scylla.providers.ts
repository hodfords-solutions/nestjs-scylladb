import { getModelToken, getConnectionToken, getRepositoryToken } from './utils/scylla-db.utils';
import { defer } from 'rxjs';
import { getEntity } from './utils/decorator.utils';
import { Provider } from '@nestjs/common';
import { RepositoryFactory } from './repositories/repository.factory';
import { Connection, ConnectionOptions } from './interfaces';
import { Repository } from './repositories/repository';
import { loadModel } from './utils/model.utils';

export function createScyllaProviders(entities?: Function[], connection?: Connection | ConnectionOptions | string) {
    const providerModel = (entity) => ({
        provide: getModelToken(entity),
        useFactory: async (connectionLike: Connection) => {
            return await defer(() => loadModel(connectionLike, entity)).toPromise();
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
