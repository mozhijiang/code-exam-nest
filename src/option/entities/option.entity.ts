import { BaseParam } from "src/base.service";
import { Question } from "src/question/entities/question.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('option')
class Option {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  optionId: number;
  @Column()
  memo: string;
  @ManyToOne(() => Question, (question) => question.questionId)
  @JoinColumn({ name: 'questionId' })
  question: Question
}
const optionParam: BaseParam = {
  primaryKey: 'optionId'
}
export {
  optionParam,
  Option
}