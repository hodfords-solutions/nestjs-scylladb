import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from 'libs';
import { CatRepository } from './cat.repository';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatEntity } from './entities/cat.entity';

@Injectable()
export class CatsService {
    private readonly logger = new Logger(CatsService.name);

    constructor(
        @InjectRepository(CatRepository)
        private readonly catRepository: CatRepository
    ) {}

    async create(createCatDto: CreateCatDto): Promise<CatEntity> {
        return this.catRepository.save(createCatDto);
    }

    findAll() {
        return this.catRepository.findAndCount({});
    }

    findById(id): Promise<CatEntity> {
        return this.catRepository.findOne({ id });
    }

    async batch() {
        const queries = [];
        const catBuilder = this.catRepository.getReturnQueryBuilder();

        queries.push(catBuilder.save({ name: 'batch cat' }));

        await this.catRepository.doBatch(queries);

        this.logger.log(`Running batch`, CatsService.name);
        this.logger.log(`Batch queries ${JSON.stringify(queries)}`, CatsService.name);

        return;
    }
}
