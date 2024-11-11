import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "../../shared/base-entities/base.entity";
import Report from "./report.entity";

@Entity({ name: "report-platforms" })
export default class ReportPlatform extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  displayName: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => Report, (report) => report.reportPlatForm, {
    nullable: true,
  })
  reports: Report[];
}
