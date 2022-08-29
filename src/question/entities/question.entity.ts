import { BaseParam } from "src/base.service";
import { Book } from "src/book/entities/book.entity";
import { Option } from "src/option/entities/option.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question')
class Question {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  questionId: number;
  @ManyToOne(() => Book, (book) => book.bookId)
  @JoinColumn({ name: 'bookId' })
  book: Book;
  @Column()
  ask: string;
  @ManyToOne(() => Option, (option) => option.optionId)
  @JoinColumn({ name: 'answerId' })
  answer: Option;
  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
  @Column()
  level: number;
  @Column()
  sort: number;
}
const questionParam: BaseParam = {
  primaryKey: 'questionId'
}
export {
  questionParam,
  Question
}