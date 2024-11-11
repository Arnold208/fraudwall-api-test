
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "../../user/entities/user.entity";
import { Comment } from "./comment.entity";
import { CaseFileStatus } from "./case-status.entity";
import Reports from "../../report/model/report.entity";

@Entity({ name: "case_files" })
export default class CaseFile {
  @PrimaryGeneratedColumn("uuid")
  caseId: string;

  @Column({
    type: "varchar",
    nullable: false,
    unique: true,
  })
  suspectNumber: string;

  @OneToMany(() => Reports, (report: Reports) => report.caseFile, {
    onDelete: "SET NULL",
    nullable: true,
  })
  reports: Reports[];

  @ManyToOne(() => CaseFileStatus, (status) => status.caseFiles, {
    onDelete: "SET NULL",
    nullable: true,
  })
  status: CaseFileStatus;

  @ManyToOne(() => User, (user) => user.caseFiles, {
    nullable: true,
    onDelete: "SET NULL",
  })
  investigator: User;

  @Column({ nullable: true })
  investigatorId: string;

  @OneToMany(() => Comment, (comment) => comment.caseFile, { nullable: true })
  comments: Comment[];

  @Column({
    type: "text",
    nullable: true,
    default: null,
  })
  remark: string;

  @UpdateDateColumn({
    type: "timestamp",
  })
  modifiedAt: Date;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  public getReports() {
    return this.reports;
  }
}
