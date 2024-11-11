import { Exclude, Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import RiskLevel from "./risk-level.entity";
import Report from "../../report/model/report.entity";


@Entity({ name: "fraud_numbers" })
export default class FraudNumberEntity {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  fraudNumberId: string;

  @Expose()
  @Column({
    unique: true,
    type: "varchar",
  })
  fraudNumber: string;

  @OneToMany(() => Report, (reports) => reports.fraudNumber, {
    nullable: false,
  })
  reports: Report[];

  @Column({
    type: "boolean",
    default: false,
  })
  visibility: boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  reported: boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  investigated: boolean;

  @Column({
    type: "boolean",
    default: false,
  })
  approved: boolean;

  @ManyToOne(() => RiskLevel, (riskLevel) => riskLevel.fraudNumber, {
    nullable: true,
    onDelete: "NO ACTION",
  })
  riskLevel: RiskLevel;

  @Column({
    type: "integer",
    default: 0,
  })
  score: number;

  @UpdateDateColumn({
    type: "timestamp",
  })
  modifiedAt: Date;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  // Virtual fields
  @Expose()
  get riskLevelType(): string {
    return this.riskLevel ? this.riskLevel.name : null;
  }

  @Expose()
  get reportCount(): number {
    return this.reports ? this.reports.length : 0;
  }

  // @Expose()
  // get reportCountByPlatform(): Record<string, number> {
  //   const countByPlatform: Record<string, number> = {};
  //   this.reports.forEach((report) => {
  //     const platformName = report.reportPlatForm.name;
  //     if (countByPlatform[platformName]) {
  //       countByPlatform[platformName]++;
  //     } else {
  //       countByPlatform[platformName] = 1;
  //     }
  //   });
  //   const totalReports = this.reportCount;
  //   const percentageByPlatform: Record<string, number> = {};
  //   for (const platform in countByPlatform) {
  //     percentageByPlatform[platform] = parseFloat(
  //       ((countByPlatform[platform] / totalReports) * 100).toFixed(2)
  //     );
  //   }
  //   return percentageByPlatform;
  // }

  @Expose()
  get reportCountByPlatform(): string[] {
    // Use a Set to store unique platform names
    const platformNames: Set<string> = new Set();

    this.reports.forEach((report) => {
      const platformName = report.reportPlatForm.name;
      platformNames.add(platformName); // Add platform name to the Set
    });

    // Convert Set to Array to return as the result
    return Array.from(platformNames);
  }
}
