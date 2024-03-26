import { Inject } from '@nestjs/common';
import { getModelToken, getRepositoryToken, getConnectionToken } from '../utils/scylla.utils';
import { Connection } from '../interfaces/externals/scylla-connection.interface';
import { ConnectionOptions } from '../interfaces/externals/scylla-client-options.interface';

export const InjectConnection: (connection?: Connection | ConnectionOptions | string) => ParameterDecorator = (
    connection?: Connection | ConnectionOptions | string
) => Inject(getConnectionToken(connection));

export const InjectModel = (entity: Function) => Inject(getModelToken(entity));

export const InjectRepository = (entity: Function) => Inject(getRepositoryToken(entity));
