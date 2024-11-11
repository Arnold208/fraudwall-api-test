import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { OriginEnum } from "../../shared/enums/origin.enum";
import { ModelNameEnum } from "../../shared/enums/model-name.enum";

@Entity({ name: "origins" })
export default class OriginEntity {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  originId: string;

  @Column({
    type: "enum",
    name: "modelName",
    enum: ModelNameEnum,
    nullable: false,
  })
  modelName: ModelNameEnum;

  @Column({ type: "varchar", nullable: true })
  suspectNumber?: string;

  @Column({ type: "enum", name: "origin", enum: OriginEnum, nullable: false })
  origin: OriginEnum;

  @UpdateDateColumn({
    type: "timestamp",
  })
  modifiedAt: Date;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;
}
