import { Column, Entity, GeneratedUUidColumn } from 'libs/decorators';

@Entity({
    table_name: 'dog',
    key: ['id']
})
export class DogEntity {
    @GeneratedUUidColumn()
    id: any;

    @Column({
        type: 'varchar'
    })
    name2: string;
}
