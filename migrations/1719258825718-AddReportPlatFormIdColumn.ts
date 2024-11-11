import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReportPlatFormIdColumn1719258825718 implements MigrationInterface {
    name = 'AddReportPlatFormIdColumn1719258825718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_cases" DROP CONSTRAINT "UQ_bea917b9a42c4d964714584379b"`);
        await queryRunner.query(`ALTER TABLE "report_cases" ADD CONSTRAINT "UQ_fb5c32d4a269472f61a5aa0e7ac" UNIQUE ("reporterNumber", "suspectNumber", "reportPlatFormId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_cases" DROP CONSTRAINT "UQ_fb5c32d4a269472f61a5aa0e7ac"`);
        await queryRunner.query(`ALTER TABLE "report_cases" ADD CONSTRAINT "UQ_bea917b9a42c4d964714584379b" UNIQUE ("reporterNumber", "suspectNumber")`);
    }

}
