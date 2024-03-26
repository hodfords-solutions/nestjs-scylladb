import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUuid, types, uuid } from 'libs';

@Injectable()
export class ParseUuidPipe implements PipeTransform<any, types.Uuid> {
    transform(value: any): types.Uuid {
        if (isUuid(value)) {
            return value;
        }

        if (!(typeof value === 'string')) {
            return value;
        }

        try {
            value = uuid(value);
        } catch (error) {
            throw new BadRequestException(`${error.message}`);
        }
        return value;
    }
}
