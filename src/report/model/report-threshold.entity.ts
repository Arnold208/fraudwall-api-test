import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "../../shared/base-entities/base.entity";

@Entity({ name: "report-thresholds" })
export default class ReportThreshold extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "integer",
    default: 0,
    unique: true,
  })
  reportCount: number;

  @Column({ type: "varchar", nullable: true, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;
}
