import { MigrationInterface, QueryRunner } from "typeorm";

export class ReportPlatforms1713916453429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "report-platforms" ("name", "displayName", "description") VALUES 
            ('phone', 'Phone', 'Report submitted via phone call'), 
            ('whatsapp', 'WhatsApp', 'Report submitted via WhatsApp message'), 
            ('twitter', 'Twitter', 'Report submitted via Twitter'), 
            ('instagram', 'Instagram', 'Report submitted via Instagram'), 
            ('facebook', 'Facebook', 'Report submitted via Facebook')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "report-platforms"`);
  }
}
