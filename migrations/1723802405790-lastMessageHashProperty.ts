import { MigrationInterface, QueryRunner } from "typeorm";

export class LastMessageHashProperty1723802405790 implements MigrationInterface {
    name = 'LastMessageHashProperty1723802405790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "lastMessageHash" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "lastMessageHash"`);
    }

}
