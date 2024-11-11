import { Exclude } from "class-transformer";
import {
  AfterLoad,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import BaseEntity from "../../shared/base-entities/base.entity";
import { Role } from "./role.entity";
import CaseFile from "../../case-file/entities/case-file.entity";
import { Comment } from "../../case-file/entities/comment.entity";
import { createBlobSasUrl } from "../../../utils/sas-token/generate-sas-token";

@Entity({ name: "users" })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ type: "varchar", nullable: false, default: null })
  firstName: string;

  @Column({ type: "varchar", nullable: false, default: null })
  lastName: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({ type: "boolean", nullable: false, default: true })
  isActive: boolean;

  @Column({ type: "timestamp", nullable: true, default: null })
  lastLogIn: Date;

  @Column({ type: "varchar", nullable: true, default: null })
  lastActivity: string;

  @Column({ type: "varchar", nullable: true, default: null, unique: true })
  resetToken: string;

  @Column({ type: "varchar", nullable: true, default: null, unique: true })
  refreshToken: string;

  @Column({ type: "varchar", nullable: true, default: null })
  avatarUrl: string;

  @Column({ type: "boolean", default: false })
  accountLocked: boolean;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
    onDelete: "SET NULL",
  })
  role: Role;

  @OneToMany(() => CaseFile, (caseFile) => caseFile.investigator, {
    nullable: true,
  })
  caseFiles: CaseFile[];

  @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
  comments: Comment[];

  @Column({ type: "timestamp", nullable: true })
  lastAssigned: Date;


    // Automatically generate SAS URL for avatarUrl after loading the entity
    @AfterLoad()
    async generateAvatarSasUrl() {
      if (this.avatarUrl) {
        this.avatarUrl = createBlobSasUrl(this.avatarUrl);
      }
    }
}
