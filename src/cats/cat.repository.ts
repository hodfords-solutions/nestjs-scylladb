import { CatEntity } from './entities/cat.entity';
import { from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';
import { Repository } from 'libs/repositories/repository';
import { EntityRepository } from 'libs';

@EntityRepository(CatEntity)
export class CatRepository extends Repository<CatEntity> {
    saveMultiple(cats: any[]) {
        return from(cats).pipe(
            mergeMap((cat) => this.save(cat)),
            toArray()
        );
    }
}
