import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
// import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
// import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('varchar', { nullable: true, length: 255 }) email: string | null;

  @Column('text', { nullable: true }) password: string | null;

  @Column('boolean', { default: false }) confirmed: boolean;

  @Column('boolean', { default: false }) forgotPasswordLocked: boolean;

  @Column('text', { nullable: true }) twitterId: string | null;

  // @BeforeUpdate()
  // async hashPasswordBeforeUpdate(): Promise<void> {
  //   if(this.password) {
  //     this.password = await bcrypt.hash(this.password, 10);
  //   }
  // }

  // @BeforeInsert()
  // async hashPasswordBeforeInsert(): Promise<void> {
  //   if(this.password) {
  //     this.password = await bcrypt.hash(this.password, 10);
  //   }
  // }
}
