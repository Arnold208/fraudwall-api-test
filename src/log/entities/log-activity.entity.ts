import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import BaseEntity from "../../shared/base-entities/base.entity";
import User from "../../user/entities/user.entity";
import { ActivityLogType } from "./log-type.entity";

@Entity({ name: "activity-logs" })
export class ActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  logId: string;

  @Column({ type: "uuid", nullable: false })
  userId: string;

  @Column({ type: "uuid", nullable: false })
  relatedEntityId: string;

  @ManyToOne(() => User, { onDelete: "NO ACTION", nullable: true })
  user: User;

  @ManyToOne(() => ActivityLogType, (logType) => logType.activityLogs, {
    nullable: true,
    onDelete: "SET NULL",
  })
  activityType: ActivityLogType;

  @Column({ type: "varchar", nullable: false })
  endPointUrl: string;

  @Column({ type: "text", nullable: false })
  details: string;

  @Column({ nullable: true, type: "varchar" })
  ipAddress: string;
}
