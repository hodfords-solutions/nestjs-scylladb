import { Inject } from '@nestjs/common';
import { getModelToken, getRepositoryToken, getConnectionToken } from '../utils/scylla-db.utils';
import { Connection, ConnectionOptions } from 'libs';

export const InjectConnection: (connection?: Connection | ConnectionOptions | string) => ParameterDecorator = (
    connection?: Connection | ConnectionOptions | string
) => Inject(getConnectionToken(connection));

export const InjectModel = (entity: Function) => Inject(getModelToken(entity));

export const InjectRepository = (entity: Function) => Inject(getRepositoryToken(entity));
