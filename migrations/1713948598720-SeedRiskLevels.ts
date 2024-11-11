import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRiskLevels1713948598720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "risk-levels" ("name", "reportCount", "displayName", "description") VALUES
          ('low', 3, 'Low Risk', 'Low risk level'),
          ('medium', 6, 'Medium Risk', 'Medium risk level'),
          ('high', 10, 'High Risk', 'High risk level');
      `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`DELETE FROM "risk-levels"`);
  }
}
