import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
// import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
// import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('varchar', { length: 255 }) email: string;

  @Column('text') password: string;

  @Column('boolean', { default: false }) confirmed: boolean;

  @Column('boolean', { default: false }) forgotPasswordLocked: boolean;

  // @BeforeUpdate()
  // async hashPasswordBeforeUpdate(): Promise<void> {
  //   if(this.password) {
  //     this.password = await bcrypt.hash(this.password, 10);
  //   }
  // }

  // @BeforeInsert()
  // async hashPasswordBeforeInsert(): Promise<void> {
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
}
