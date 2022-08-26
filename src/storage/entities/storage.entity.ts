import { BaseParam } from "src/base.service";
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('storage')
class Storage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  storageId: number;
  @Column()
  name: string;
  @Column()
  originalName: string;
  @Column()
  mime: string;
  @Column()
  path: string;
  @Column()
  hash: string;
  @Column({ type: 'date' })
  time: Date;
}
const storageParam: BaseParam = {
  primaryKey: 'storageId'
}
export {
  storageParam,
  Storage
}