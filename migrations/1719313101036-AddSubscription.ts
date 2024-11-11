import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscription1719313101036 implements MigrationInterface {
    name = 'AddSubscription1719313101036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscriptions" ("subscriptionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "subscriberNumber" character varying NOT NULL, "subscriberEmail" character varying, "notifyMe" boolean NOT NULL DEFAULT false, "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2033d28b037f3009c5dee69daef" UNIQUE ("subscriberNumber"), CONSTRAINT "UQ_58ce8102ac95f63464343a170cf" UNIQUE ("subscriberEmail"), CONSTRAINT "UQ_b3b6775224ee2f8864176ffc186" UNIQUE ("subscriberNumber", "subscriberEmail"), CONSTRAINT "PK_06ba17ac2e047b1ef52051edf09" PRIMARY KEY ("subscriptionId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscriptions"`);
    }

}
