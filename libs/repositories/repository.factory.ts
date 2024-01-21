/* eslint-disable @typescript-eslint/naming-convention */
import { Repository } from './repository';
import { BaseModel } from '../interfaces/externals/scylla-db.interface';
import { ReturnQueryBuilder } from './builder/return-query.builder';

export class RepositoryFactory {
    static create<T>(entity: Function, model: BaseModel, EntityRepository = Repository): Repository<T> {
        const repository = new EntityRepository();
        const returnQueryBuilder = new ReturnQueryBuilder(model);
        Object.assign(repository, { target: entity, model, returnQueryBuilder });
        return repository;
    }
}
