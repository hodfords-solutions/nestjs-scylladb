import { ScyllaModuleOptions } from 'libs';

export const scyllaOptions: ScyllaModuleOptions = {
    clientOptions: {
        contactPoints: ['localhost'],
        keyspace: 'test',
        protocolOptions: {
            port: 9042
        },
        queryOptions: {
            consistency: 1
        }
        // authProvider: new auth.PlainTextAuthProvider('scylla', 'scylla')
    },
    ormOptions: {
        createKeyspace: true,
        defaultReplicationStrategy: {
            class: 'SimpleStrategy',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            replication_factor: 1
        },
        migration: 'safe'
    }
};
