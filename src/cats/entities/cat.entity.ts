import { Column, CreateDateColumn, Entity, GeneratedUUidColumn, UpdateDateColumn } from 'libs';

@Entity({
    tableName: 'cat',
    key: ['id']
})
export class CatEntity {
    @GeneratedUUidColumn()
    id: string;

    @CreateDateColumn()
    createdAt: number;

    @UpdateDateColumn()
    updatedAt: number;

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
}
