import { ColumnType, DataType } from './data.type';

export interface ColumnOptions {
    type?: ColumnType | DataType;

    typeDef?: string;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    default?: string | (() => any) | Function | { $db_function: string };

    virtual?: { get?: any; set?: any };

    rule?: ColumnRuleOptions | ((value: any) => boolean);

    static?: boolean;
}

export interface ColumnRuleOptions {
    validator?: (value: any) => boolean;

    validators?: any[];

    message?: string | ((value: any) => string);

    ignoreDefault?: boolean;

    required?: boolean;
}
