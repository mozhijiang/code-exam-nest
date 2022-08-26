import { BaseParam } from "src/base.service";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('book')
class Book {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    bookId: number;
    @Column()
    name: string;
}
const bookParam: BaseParam = {
    primaryKey: 'bookId'
}
export {
    bookParam,
    Book
}