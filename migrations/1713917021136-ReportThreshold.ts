import { MigrationInterface, QueryRunner } from "typeorm";

export class ReportThreshold1713917021136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "report-thresholds" ("reportCount", "name", "description") VALUES 
            (2, 'reportThreshold', 'Threshold for reporting')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "report-thresholds"`);
  }
}
