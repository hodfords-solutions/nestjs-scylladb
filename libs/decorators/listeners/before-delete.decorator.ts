/* eslint-disable @typescript-eslint/naming-convention */
import { BEFORE_DELETE } from '../../constants/constant';
import { getOptions, addOptions, addHookFunction } from '../../utils/decorator.utils';

export function BeforeDelete(): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        const hookFuncLikeArray = Reflect.getMetadata(BEFORE_DELETE, target) || [];
        hookFuncLikeArray.push(descriptor.value);
        Reflect.defineMetadata(BEFORE_DELETE, hookFuncLikeArray, target);

        const { before_delete } = getOptions(target);
        if (!before_delete) {
            addOptions(target, {
                before_save: addHookFunction(target, BEFORE_DELETE)
            });
        }
        return descriptor;
    };
}
