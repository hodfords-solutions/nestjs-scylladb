/* eslint-disable @typescript-eslint/naming-convention */
import { BEFORE_UPDATE } from '../../constants/constant';
import { getOptions, addOptions, addHookFunction } from '../../utils/decorator.utils';

export function BeforeUpdate(): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const hookFuncLikeArray = Reflect.getMetadata(BEFORE_UPDATE, target) || [];
        hookFuncLikeArray.push(descriptor.value);
        Reflect.defineMetadata(BEFORE_UPDATE, hookFuncLikeArray, target);

        const { before_update } = getOptions(target);
        if (!before_update) {
            addOptions(target, {
                before_save: addHookFunction(target, BEFORE_UPDATE)
            });
        }
        return descriptor;
    };
}
