import { BaseParam } from "src/base.service";
import { Question } from "src/question/entities/question.entity";
import { Storage } from "src/storage/entities/storage.entity";
import { Tag } from "src/tag/entities/tag.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('book')
class Book {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    bookId: number;
    @Column()
    name: string;
    @ManyToOne(() => Storage, (storage) => storage.storageId)
    @JoinColumn({ name: 'coverId' })
    cover: Storage;
    @ManyToMany(() => Tag, (tag) => tag.tagId)
    @JoinTable({ name: 'books_tags', joinColumn: { name: 'bookId' }, inverseJoinColumn: { name: 'tagId' } })
    tags: Tag[];
    @OneToMany(() => Question, (question) => question.book)
    questions: Question[];
    @Column({ default: 0 })
    level: number;
}
const bookParam: BaseParam = {
    primaryKey: 'bookId',
    baseRelations: ['cover', 'tags']
}
export {
    bookParam,
    Book
}