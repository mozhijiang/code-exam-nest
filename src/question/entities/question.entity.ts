import { BaseParam } from "src/base.service";
import { Book } from "src/book/entities/book.entity";
import { Option } from "src/option/entities/option.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question')
class Question {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  questionId: number;
  @ManyToOne(() => Book, (book) => book.bookId)
  @JoinColumn({ name: 'bookId' })
  book: Book;
  @Column({ default: '' })
  title: string;
  @Column()
  ask: string;
  @Column({ default: 'radio' })
  type: 'ratio' | 'multiSelect';
  @ManyToMany(() => Option, (option) => option.optionId)
  @JoinTable({ name: 'questions_answers', joinColumn: { name: 'questionId' }, inverseJoinColumn: { name: 'optionId' } })
  answer: Option[];
  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
  @Column()
  level: number;
  @Column()
  sort: number;
  @Column({ default: '' })
  answerMemo: string;

}
const questionParam: BaseParam = {
  primaryKey: 'questionId',
  baseRelations: ['book','options']
}
export {
  questionParam,
  Question
}