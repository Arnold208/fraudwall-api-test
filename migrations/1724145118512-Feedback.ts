import { MigrationInterface, QueryRunner } from "typeorm";

export class Feedback1724145118512 implements MigrationInterface {
    name = 'Feedback1724145118512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedbacks" ("feedbackId" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "message" text NOT NULL, "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_afc4a022b8f00a49eb6657c432d" PRIMARY KEY ("feedbackId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "feedbacks"`);
    }

}
