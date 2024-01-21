import { Logger } from '@nestjs/common';
import { AfterSave, BeforeSave, Column, CreateDateColumn, Entity, GeneratedUUidColumn, UpdateDateColumn } from 'libs';

@Entity({
    table_name: 'cat',
    key: ['id']
})
export class CatEntity {
    @GeneratedUUidColumn()
    id: any;

    @GeneratedUUidColumn('timeuuid')
    timeId: any;

    @Column({
        type: 'varchar'
    })
    name: string;

    @Column({
        type: 'int'
    })
    age2: number;

    @Column({
        type: 'varchar'
    })
    breed2: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeSave()
    beforeSave(instance: this, options: any) {
        Logger.log('Before save called', CatEntity.name);
    }

    @AfterSave()
    afterSave(instance: this, options: any) {
        Logger.log('After save called', CatEntity.name);
    }
}
