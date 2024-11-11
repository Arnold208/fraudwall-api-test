import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "feedbacks" })
export default class FeedbackEntity {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  feedbackId: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  firstName: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  lastName: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  email: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    type: "text",
  })
  message: string;

  @UpdateDateColumn({
    type: "timestamp",
  })
  modifiedAt: Date;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;
}
