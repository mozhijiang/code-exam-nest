import { BaseParam } from "src/base.service";
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tag')
class Tag {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  tagId: number;
  @Column()
  name: string;
}
const tagParam: BaseParam = {
  primaryKey: 'tagId'
}
export {
  tagParam,
  Tag
}