import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import BaseEntity from "../../shared/base-entities/base.entity";
import { ActivityLog } from "./log-activity.entity";

@Entity({ name: "activity-log-types" })
export class ActivityLogType extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.activityType, {
    nullable: true,
  })
  activityLogs: ActivityLog;

  @BeforeInsert()
  @BeforeUpdate()
  changeNameToLowerCase() {
    this.name = this.name.toLowerCase();
  }
}
