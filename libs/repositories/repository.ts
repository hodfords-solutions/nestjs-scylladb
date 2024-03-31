import { Type } from '@nestjs/common';
import { types } from 'cassandra-driver';
import { Observable, Subject, defer, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import snakecaseKeys from 'snakecase-keys';
import { EntityNotFoundError } from '../errors/entity-not-found.error';
import { ConnectionOptions } from '../interfaces/externals/scylla-client-options.interface';
import { Connection } from '../interfaces/externals/scylla-connection.interface';
import {
    BaseModel,
    DeleteOptionsStatic,
    FindQuery,
    FindQueryOptionsStatic,
    RawFindQueryOptionsStatic,
    SaveOptionsStatic,
    UpdateOptionsStatic
} from '../interfaces/externals/scylla.interface';
import { uuid } from '../utils/db.utils';
import { getEntity } from '../utils/decorator.utils';
import { getSchema } from '../utils/model.utils';
import { transformEntity } from '../utils/transform-entity.utils';
import { ReturnQueryBuilder } from './builder/return-query.builder';
import { RepositoryFactory } from './repository.factory';
import { snakeCase } from 'lodash';

const defaultOptions = {
    findOptions: { raw: true },
    updateOptions: snakecaseKeys({ ifExists: true }),
    deleteOptions: snakecaseKeys({ ifExists: true })
};

const convertedFindQueryOptions = ['materializedView', 'allowFiltering'];

export class Repository<Entity = any> {
    readonly model: BaseModel<Entity>;

    readonly target: Type<Entity>;

    readonly returnQueryBuilder: ReturnQueryBuilder<Entity>;

    constructor() {}

    static make(options: Partial<ConnectionOptions>): Repository {
        const entity = getEntity(this);
        const connection = new Connection(options);
        const model = connection.loadSchema(entity.name, getSchema(entity));

        return RepositoryFactory.create(entity, model, this);
    }

    private mapFindQueryOptions(options?: FindQueryOptionsStatic<Entity>): RawFindQueryOptionsStatic<Entity> {
        return Object.entries(options).reduce(
            (option, [key, value]) => ({
                ...option,
                [`${convertedFindQueryOptions.includes(key) ? snakeCase(key) : key}`]: value
            }),
            {}
        );
    }

    create(entity?: Partial<Entity>): Entity;

    create(entityLikeArray: Partial<Entity>[]): Entity[];

    create(entityLike?: any): Entity | Entity[] {
        return transformEntity(this.target, entityLike);
    }

    findOne(query: FindQuery<Entity>, options?: FindQueryOptionsStatic<Entity>): Promise<Entity>;

    findOne(
        query: FindQuery<Entity>,
        options: FindQueryOptionsStatic<Entity> = { allowFiltering: true }
    ): Promise<Entity> {
        if (query[`id`] && typeof query[`id`] === 'string') {
            query[`id`] = uuid(query[`id`]);
        }

        return lastValueFrom(
            defer(() =>
                this.model.findOneAsync(query, {
                    ...this.mapFindQueryOptions(options),
                    ...defaultOptions.findOptions
                })
            ).pipe(map((x) => x && transformEntity(this.target, x)))
        );
    }

    findOneOrFail(query: FindQuery<Entity>, options?: FindQueryOptionsStatic<Entity>): Promise<Entity>;

    findOneOrFail(query: FindQuery<Entity>, maybeOptions: FindQueryOptionsStatic<Entity> = {}): Promise<Entity> {
        return this.findOne(query, maybeOptions).then((entity) => {
            if (entity === undefined) {
                throw new EntityNotFoundError(this.target, query);
            }
            return entity;
        });
    }

    find(query: FindQuery<Entity>, options?: FindQueryOptionsStatic<Entity>): Promise<Entity[]>;

    find(
        query: FindQuery<Entity>,
        options: FindQueryOptionsStatic<Entity> = { allowFiltering: true }
    ): Promise<Entity[]> {
        if (query[`id`] && typeof query[`id`] === 'string') {
            query[`id`] = uuid(query[`id`]);
        }

        return lastValueFrom(
            defer(() =>
                this.model.findAsync(query, {
                    ...this.mapFindQueryOptions(options),
                    ...defaultOptions.findOptions
                })
            ).pipe(map((x) => transformEntity(this.target, x)))
        );
    }

    findAndCount(
        query: FindQuery<Entity>,
        options: FindQueryOptionsStatic<Entity> = { allowFiltering: true }
    ): Promise<[Entity[], number]> {
        if (query[`id`] && typeof query[`id`] === 'string') {
            query[`id`] = uuid(query[`id`]);
        }

        return lastValueFrom(
            defer(() =>
                this.model.findAsync(query, {
                    ...this.mapFindQueryOptions(options),
                    ...defaultOptions.findOptions
                })
            ).pipe(
                map((x) => transformEntity(this.target, x)),
                map((entities) => [entities, entities.length] as [Entity[], number])
            )
        );
    }

    save(entity: Partial<Entity>, options?: SaveOptionsStatic): Promise<Entity>;

    save(entities: Partial<Entity>[], options?: SaveOptionsStatic): Promise<Entity[]>;

    save(
        entityLike: Partial<Entity> | Partial<Entity>[],
        options: SaveOptionsStatic = {}
    ): Promise<Entity> | Promise<Entity[]> {
        const saveFunc = async (entity) => {
            const model = new this.model(entity);
            await model.saveAsync(options);
            return transformEntity(this.target, model.toJSON());
        };
        const saveMultipleFunc = (arrayLike: Entity[]) => Promise.all(arrayLike.map((x) => saveFunc(x)));

        return Array.isArray(entityLike)
            ? lastValueFrom(defer(() => saveMultipleFunc(entityLike as any)))
            : lastValueFrom(defer(() => saveFunc(entityLike as any)));
    }

    update(query: FindQuery<Entity>, updateValue: Partial<Entity>, options?: UpdateOptionsStatic<Entity>): Promise<any>;

    update(
        query: FindQuery<Entity>,
        updateValue: Partial<Entity>,
        options: UpdateOptionsStatic<Entity> = {}
    ): Promise<any> {
        if (query[`id`] && typeof query[`id`] === 'string') {
            query[`id`] = uuid(query[`id`]);
        }

        return lastValueFrom(
            defer(() =>
                this.model.updateAsync(query, updateValue, {
                    ...defaultOptions.updateOptions,
                    ...options
                })
            )
        );
    }

    remove(entity: Entity, options?: DeleteOptionsStatic): Promise<Entity>;

    remove(entity: Entity[], options?: DeleteOptionsStatic): Promise<Entity[]>;

    remove(entityOrEntities: Entity | Entity[], options: DeleteOptionsStatic = {}): Promise<Entity | Entity[]> {
        const removeFunc = (entity) =>
            new this.model(entity).deleteAsync({
                ...defaultOptions.deleteOptions,
                ...options
            });
        const promiseArray =
            entityOrEntities instanceof Array
                ? entityOrEntities.map((x) => removeFunc(x))
                : [removeFunc(entityOrEntities)];

        return lastValueFrom(defer(() => Promise.all(promiseArray)).pipe(map(() => entityOrEntities)));
    }

    delete(query: FindQuery<Entity>, options?: DeleteOptionsStatic): Promise<any>;

    delete(query: FindQuery<Entity> = {}, options = {}) {
        if (query[`id`] && typeof query[`id`] === 'string') {
            query[`id`] = uuid(query[`id`]);
        }

        return lastValueFrom(
            defer(() =>
                this.model.deleteAsync(query, {
                    ...defaultOptions.deleteOptions,
                    ...options
                })
            )
        );
    }

    truncate(): Promise<any> {
        return lastValueFrom(defer(() => this.model.truncateAsync()));
    }

    stream(
        query: FindQuery<Entity>,
        options: FindQueryOptionsStatic<Entity> = { allowFiltering: true }
    ): Promise<Entity> {
        const reader$ = new Subject<any>();

        const onRead = (reader): void => {
            while (true) {
                const row = reader.readRow();
                if (row === null) {
                    break;
                }
                reader$.next(transformEntity(this.target, row));
            }
        };

        const onDone = (error): void => {
            if (error) {
                reader$.error(error);
            }
            reader$.complete();
            return;
        };

        if (query[`id`] && typeof query[`id`] === 'string') {
            query[`id`] = uuid(query[`id`]);
        }

        this.model.stream(
            query,
            { ...this.mapFindQueryOptions(options), ...defaultOptions.findOptions },
            onRead,
            onDone
        );

        return lastValueFrom(reader$.asObservable());
    }

    eachRow(
        query: FindQuery<Entity>,
        options: FindQueryOptionsStatic<Entity> = { allowFiltering: true }
    ): EachRowArgument {
        const reader$ = new Subject<any>();
        const done$ = new Subject<any>();
        const getReader = () => reader$.asObservable();
        const getDone = () => done$.asObservable();

        const onRow = (n, row): void => reader$.next(transformEntity(this.target, row));
        const onDone = (err: Error, result: any): void => {
            if (err) {
                reader$.error(err);
                done$.error(err);
            } else {
                done$.next(result);
            }
            reader$.complete();
            done$.complete();
        };

        if (query[`id`] && typeof query[`id`] === 'string') {
            query[`id`] = uuid(query[`id`]);
        }

        this.model.eachRow(
            query,
            { ...this.mapFindQueryOptions(options), ...defaultOptions.findOptions },
            onRow,
            onDone
        );

        return { getReader, getDone };
    }

    get getModelRef(): BaseModel<Entity> {
        return this.model;
    }

    getReturnQueryBuilder(): ReturnQueryBuilder<Entity> {
        return this.returnQueryBuilder;
    }

    doBatch(queries): Promise<any> {
        return this.model.execute_batchAsync(queries);
    }
}

export interface EachRowArgument {
    getReader<T = any>(): Observable<T>;

    getDone(): Observable<types.ResultSet>;
}
