import { MigrationInterface, QueryRunner } from "typeorm";

export class OriginLogEntity1726223507061 implements MigrationInterface {
    name = 'OriginLogEntity1726223507061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."origins_modelname_enum" AS ENUM('Report', 'Fraud')`);
        await queryRunner.query(`CREATE TYPE "public"."origins_origin_enum" AS ENUM('Web', 'USSD', 'Telegram', 'Instagram', 'Facebook', 'WhatsApp', 'x', 'Portal')`);
        await queryRunner.query(`CREATE TABLE "origins" ("originId" uuid NOT NULL DEFAULT uuid_generate_v4(), "modelName" "public"."origins_modelname_enum" NOT NULL, "suspectNumber" character varying, "origin" "public"."origins_origin_enum" NOT NULL, "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_62b6e6454de0eca3f70f4f89a77" PRIMARY KEY ("originId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "origins"`);
        await queryRunner.query(`DROP TYPE "public"."origins_origin_enum"`);
        await queryRunner.query(`DROP TYPE "public"."origins_modelname_enum"`);
    }

}
