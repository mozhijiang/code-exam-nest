import { BaseParam } from "src/base.service";
import { Storage } from "src/storage/entities/storage.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('book')
class Book {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    bookId: number;
    @Column()
    name: string;
    @ManyToOne(() => Storage, (storage) => storage.storageId)
    @JoinColumn({ name: 'coverId' })
    cover: Storage;
}
const bookParam: BaseParam = {
    primaryKey: 'bookId',
    baseRelations: ['cover']
}
export {
    bookParam,
    Book
}