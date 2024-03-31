import snakecaseKeys from 'snakecase-keys';
import { EntityOptions } from '../interfaces/entity-options.interface';
import { addOptions, setEntityName } from '../utils/decorator.utils';

export function Entity(nameOrOptions?: string | EntityOptions, maybeOptions?: EntityOptions): ClassDecorator {
    const options: any = (typeof nameOrOptions === 'object' ? (nameOrOptions as EntityOptions) : maybeOptions) || {};
    const name = typeof nameOrOptions === 'string' ? nameOrOptions : options.tableName;

    return (target): void => {
        options.instanceMethods = target.prototype;
        options.classMethods = target;

        setEntityName(target.prototype, name);
        addOptions(target.prototype, snakecaseKeys(options, { deep: false }));
    };
}
