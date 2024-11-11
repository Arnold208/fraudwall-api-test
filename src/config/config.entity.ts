// src/config-key/entities/config-key.entity.ts

import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from "typeorm";
import BaseEntity from "../shared/base-entities/base.entity";

@Entity("config-rules")
export class ConfigRule extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  ruleId: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  ruleName: string;

  @Column({ type: "varchar", nullable: false })
  value: string | number;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeKeyCase() {
    this.ruleName = this.ruleName.toLocaleLowerCase();
  }
}
