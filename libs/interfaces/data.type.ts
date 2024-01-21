export type CassandraType =
    | 'int'
    | 'boolean'
    | 'text'
    | 'varchar'
    | 'uuid'
    | 'timeuuid'
    | 'timestamp'
    | 'date'
    | 'map'
    | 'set'
    | 'list'
    | 'double'
    | 'float'
    | 'decimal'
    | 'smallint'
    | 'bigint'
    | 'tinyint'
    | 'varint'
    | 'ascii'
    | 'counter'
    | 'inet'
    | 'time'
    | 'tuple'
    | 'frozen'
    | 'blob';

export type WithWidthColumnType = 'int' | 'smallint' | 'bigint' | 'tinyint' | 'varint';

export type ModelColumnType =
    | 'bigint'
    | 'blob'
    | 'counter'
    | 'date'
    | 'decimal'
    | 'inet'
    | 'time'
    | 'timeuuid'
    | 'tuple'
    | 'uuid'
    | 'varint';

export type ColumnType = CassandraType | WithWidthColumnType | ModelColumnType;

export enum DataType {
    MAP = 'map',
    LIST = 'list',
    SET = 'set',
    FROZEN = 'frozen',
    NUMBER = 'int',
    TEXT = 'text',
    BOOLEAN = 'boolean',
    VARCHAR = 'varchar',
    UUID = 'uuid',
    TIMEUUID = 'timeuuid',
    TIMESTAMP = 'timestamp',
    DATE = 'date',
    DOUBLE = 'double',
    FLOAT = 'float',
    DECIMAL = 'decimal',
    SMALLINT = 'smallint',
    BIGINT = 'bigint',
    TINYINT = 'tinyint',
    VARINT = 'varint',
    COUNTER = 'counter',
    INET = 'inet',
    TIME = 'time',
    TUPLE = 'tuple',
    BLOB = 'blob'
}
