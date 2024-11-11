import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "../../shared/base-entities/base.entity";
import CaseFile from "./case-file.entity";
import User from "../../user/entities/user.entity";

@Entity({ name: "case-comments" })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  commentId: string;

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    onDelete: "SET NULL",
  })
  user: User;

  @ManyToOne(() => CaseFile, { nullable: false, onDelete: "SET NULL" })
  caseFile: CaseFile;

  @Column({ type: "text", nullable: false })
  notes: string;
}
