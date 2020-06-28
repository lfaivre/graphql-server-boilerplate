import { Entity, PrimaryColumn, Column, BeforeInsert, BaseEntity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
// eslint-disable-next-line import/prefer-default-export
export class User extends BaseEntity {
  @PrimaryColumn('uuid') id: string;

  @Column('varchar', { length: 255 }) email: string;

  @Column('text') password: string;

  @BeforeInsert()
  addId(): void {
    this.id = uuidv4();
  }
}
