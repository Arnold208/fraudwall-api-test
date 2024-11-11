import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCaseFileStatuses1713949574932 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "case-statuses" ("name", "description") VALUES
        ('opened', 'New Case Opened'),
        ('investigation', 'Under Investigation'),
        ('review', 'Under Review'),
        ('approved', 'Case Approved'),
        ('closed', 'Case Closed'),
        ('archived', 'Case Archived');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "case-statuses"`);
  }
}
