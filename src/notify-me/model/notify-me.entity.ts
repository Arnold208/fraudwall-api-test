import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Unique(["subscriberNumber", "subscriberEmail"])
@Entity({ name: "subscriptions" })
export default class SubscriptionEntity {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  subscriptionId: string;

  @Column({
    unique: true,
    type: "varchar",
    nullable: false,
  })
  subscriberNumber: string;

  @Column({
    unique: true,
    type: "varchar",
    nullable: true,
  })
  subscriberEmail: string;

  @Column({
    type: "boolean",
    default: false,
  })
  notifyMe: boolean;

  @Column({ nullable: true, type: "text" })
  lastMessageHash: string;

  @UpdateDateColumn({
    type: "timestamp",
  })
  modifiedAt: Date;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;
}
