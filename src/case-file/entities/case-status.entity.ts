import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "../../shared/base-entities/base.entity";
import CaseFile from "./case-file.entity";

@Entity({ name: "case-statuses" })
export class CaseFileStatus extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  statusId: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  name: string;

  @OneToMany(() => CaseFile, (caseFile) => caseFile.status, { nullable: true })
  caseFiles: CaseFile[];

  @Column({ type: "text", nullable: false })
  description: string;
}
