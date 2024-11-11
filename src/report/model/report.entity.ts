import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Exclude, Expose } from "class-transformer";
import CaseFile from "../../case-file/entities/case-file.entity";
import FraudNumberEntity from "../../fraud-number/model/fraud-number.entity";
import ReportPlatform from "./report-platform";
import { decryptText, encryptText } from "../../../utils/encryption/encryption";
import { createBlobSasUrl } from "../../../utils/sas-token/generate-sas-token";

@Unique(["reporterNumber", "suspectNumber", "reportPlatFormId"])
@Entity({ name: "report_cases" })
export default class Report {
  @Exclude()
  @PrimaryGeneratedColumn("uuid")
  reportId: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  reporterNumber: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  suspectNumber: string;

  @Column({
    type: "uuid",
    nullable: true,
  })
  reportPlatFormId: string;

  @ManyToOne(() => ReportPlatform, { nullable: true, onDelete: "NO ACTION" })
  reportPlatForm: ReportPlatform;

  @Column({
    type: "text",
    nullable: true,
    default: null,
  })
  description: string;

  @ManyToOne(() => CaseFile, (casefile: CaseFile) => casefile.reports, {
    onDelete: "SET NULL",
    nullable: true,
  })
  caseFile: CaseFile;

  @ManyToOne(
    () => FraudNumberEntity,
    (fraudNumber: FraudNumberEntity) => fraudNumber.reports,
    {
      onDelete: "SET NULL",
      nullable: true,
    }
  )
  fraudNumber: FraudNumberEntity;

  @Column({ type: "varchar", array: true, nullable: true })
  reportFiles: string[];

  @Column({
    type: "date",
    nullable: true,
    default: null,
  })
  incidentDate: Date;

  @Column({ type: "boolean", default: false })
  archived: boolean;

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
  static getReportCountByPlatform(reports: Report[]): Record<string, number> {
    const countByPlatform: Record<string, number> = {};
    reports.forEach((report) => {
      const platformName = report.reportPlatForm.name;
      if (countByPlatform[platformName]) {
        countByPlatform[platformName]++;
      } else {
        countByPlatform[platformName] = 1;
      }
    });
    const totalReports = reports.length;
    const percentageByPlatform: Record<string, number> = {};
    for (const platform in countByPlatform) {
      percentageByPlatform[platform] = parseFloat(
        ((countByPlatform[platform] / totalReports) * 100).toFixed(2)
      );
    }
    return percentageByPlatform;
  }

  @Expose()
  static getTotalReports(reports: Report[]): number {
    return reports.length;
  }

  // Encrypt before saving
  @BeforeInsert()
  @BeforeUpdate()
  encryptSensitiveFields() {
    if (this.reporterNumber)
      this.reporterNumber = encryptText(this.reporterNumber);
    if (this.suspectNumber)
      this.suspectNumber = encryptText(this.suspectNumber);
    if (this.description) this.description = encryptText(this.description);
  }

  // // // Decrypt after loading from the database
  @AfterLoad()
  async decryptSensitiveFields() {
    if (this.reporterNumber)
      this.reporterNumber = decryptText(this.reporterNumber);
    if (this.suspectNumber)
      this.suspectNumber = decryptText(this.suspectNumber);
    if (this.description) this.description = decryptText(this.description);
    // Generate SAS URLs for reportFiles array
    if (this.reportFiles && this.reportFiles.length > 0) {
      const sasUrls = await Promise.all(
        this.reportFiles.map(async (fileUrl) => {
          return createBlobSasUrl(fileUrl);
        })
      );
      this.reportFiles = sasUrls; // Replace original reportFiles with SAS URLs
    }
  }
}
