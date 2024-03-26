import { FindSubQueryStatic } from './externals/scylla.interface';

export interface EntityOptions<T = object> {
    tableName?: string;

    key?: Array<string | Array<string>>;

    materializedViews?: { [index: string]: MaterializeViewStatic<T> };

    clusteringOrder?: { [index: string]: 'desc' | 'asc' };

    options?: EntityExtraOptions;

    indexes?: Array<keyof T> | string[];

    customIndexes?: Partial<CustomIndexOptions>[];

    methods?: { [index: string]: Function };

    esIndexMapping?: {
        discover?: string;

        properties?: EsIndexPropertiesOptionsStatic<T>;
    };

    graphMapping?: Partial<GraphMappingOptionsStatic<T | { [index: string]: any }>>;

    [index: string]: any;
}

export type ClusterOrder<T = any> = { [P in keyof T]?: 'desc' | 'asc' };

export interface MaterializeViewStatic<T> {
    select?: Array<keyof T>;

    key: Array<keyof T | Array<keyof T>>;

    clusteringOrder?: ClusterOrder<T>;

    filter?: FilterOptions<T>;
}

export interface EntityExtraOptions {
    timestamps?: {
        createdAt?: string;

        updatedAt?: string;
    };

    versions?: { key: string };
}

type FilterOptions<T> = Partial<{ [P in keyof T]: FindSubQueryStatic }>;

interface CustomIndexOptions {
    on: string;

    using: any;

    options: any;
}

type EsIndexPropertiesOptionsStatic<T> = {
    [P in keyof T]?: { type?: string; index?: string };
};

interface GraphMappingOptionsStatic<Entity = any> {
    relations: {
        follow?: 'MULTI' | 'SIMPLE' | 'MANY2ONE' | 'ONE2MANY' | 'ONE2ONE';

        mother?: 'MULTI' | 'SIMPLE' | 'MANY2ONE' | 'ONE2MANY' | 'ONE2ONE';
    };

    properties: {
        [index: string]: {
            type?: JanusGraphDataTypes;

            cardinality?: 'SINGLE' | 'LIST' | 'SET';
        };
    };

    indexes: {
        [index: string]: {
            type?: 'Composite' | 'Mixed' | 'VertexCentric';

            keys?: Array<keyof Entity | object>;

            label?: 'follow';

            direction?: 'BOTH' | 'IN' | 'OUT';

            order?: 'incr' | 'decr';

            unique?: boolean;
        };
    };
}

type JanusGraphDataTypes =
    | 'Integer'
    | 'String'
    | 'Character'
    | 'Boolean'
    | 'Byte'
    | 'Short'
    | 'Long'
    | 'Float'
    | 'Double'
    | 'Date'
    | 'Geoshape'
    | 'UUID';
