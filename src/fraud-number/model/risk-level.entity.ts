import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "../../shared/base-entities/base.entity";

import FraudNumberEntity from "./fraud-number.entity";

@Entity({ name: "risk-levels" })
export default class RiskLevel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  name: string;

  @Column({
    type: "integer",
    default: 0,
    unique: true,
  })
  reportCount: number;

  @Column({ type: "varchar", nullable: true })
  displayName: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => FraudNumberEntity, (fraudNumber) => fraudNumber.riskLevel, {
    nullable: true,
  })
  fraudNumber: FraudNumberEntity[];
}
