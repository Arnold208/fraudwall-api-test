import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1707568976535 implements MigrationInterface {
    name = 'InitialMigration1707568976535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "risk-levels" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "reportCount" integer NOT NULL DEFAULT '0', "displayName" character varying, "description" text, CONSTRAINT "UQ_698308f32036ee3f20c5cbb4016" UNIQUE ("name"), CONSTRAINT "UQ_c11d249b83acff0df0b259a60d7" UNIQUE ("reportCount"), CONSTRAINT "PK_268d34895a00e132d6f8773a4f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fraud_numbers" ("fraudNumberId" uuid NOT NULL DEFAULT uuid_generate_v4(), "fraudNumber" character varying NOT NULL, "visibility" boolean NOT NULL DEFAULT false, "reported" boolean NOT NULL DEFAULT false, "investigated" boolean NOT NULL DEFAULT false, "approved" boolean NOT NULL DEFAULT false, "score" integer NOT NULL DEFAULT '0', "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "riskLevelId" uuid, CONSTRAINT "UQ_694c50a0100be625e1752eb5fcc" UNIQUE ("fraudNumber"), CONSTRAINT "PK_36acaf569d9fe5484ee3b9a5080" PRIMARY KEY ("fraudNumberId"))`);
        await queryRunner.query(`CREATE TABLE "report-platforms" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "displayName" character varying, "description" text, CONSTRAINT "UQ_41e0cf7dbc2aef74f8f15b859b2" UNIQUE ("name"), CONSTRAINT "PK_e14048f0b02c7efa786a53d2640" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_cases" ("reportId" uuid NOT NULL DEFAULT uuid_generate_v4(), "reporterNumber" character varying NOT NULL, "suspectNumber" character varying NOT NULL, "description" text, "reportFiles" character varying array, "incidentDate" date, "archived" boolean NOT NULL DEFAULT false, "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "reportPlatFormId" uuid, "caseFileCaseId" uuid, "fraudNumberFraudNumberId" uuid, CONSTRAINT "UQ_bea917b9a42c4d964714584379b" UNIQUE ("reporterNumber", "suspectNumber"), CONSTRAINT "PK_8079bde609e4d085ff85ed55412" PRIMARY KEY ("reportId"))`);
        await queryRunner.query(`CREATE TABLE "case-comments" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "commentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "notes" text NOT NULL, "userUserId" uuid NOT NULL, "caseFileCaseId" uuid NOT NULL, CONSTRAINT "PK_1ca14f73d687bcaeb4d8a895b69" PRIMARY KEY ("commentId"))`);
        await queryRunner.query(`CREATE TABLE "case-statuses" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "statusId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_718d7f5c2ef3a23929c89ab8685" UNIQUE ("name"), CONSTRAINT "PK_f25c67129cc6b053344d5b26d57" PRIMARY KEY ("statusId"))`);
        await queryRunner.query(`CREATE TABLE "case_files" ("caseId" uuid NOT NULL DEFAULT uuid_generate_v4(), "suspectNumber" character varying NOT NULL, "investigatorId" character varying, "remark" text, "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "statusStatusId" uuid, "investigatorUserId" uuid, CONSTRAINT "UQ_5dbdf9a1c38f0134b58d58bf07e" UNIQUE ("suspectNumber"), CONSTRAINT "PK_db97076842ce70bb67379d5f349" PRIMARY KEY ("caseId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "lastLogIn" TIMESTAMP, "lastActivity" character varying, "resetToken" character varying, "refreshToken" character varying, "avatarUrl" character varying, "accountLocked" boolean NOT NULL DEFAULT false, "lastAssigned" TIMESTAMP, "roleId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a4bfb41ec19ba07b20d6e1ed023" UNIQUE ("resetToken"), CONSTRAINT "UQ_4fdf5f552fcfe06082a35e97288" UNIQUE ("refreshToken"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleName" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_992f24b9d80eb1312440ca577f1" UNIQUE ("roleName"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity-log-types" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_e63d5e0dd545b1f3d054dc2d309" UNIQUE ("name"), CONSTRAINT "PK_7fae9a0498c23551cb039c2c2f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity-logs" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "logId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "relatedEntityId" uuid NOT NULL, "endPointUrl" character varying NOT NULL, "details" text NOT NULL, "ipAddress" character varying, "userUserId" uuid, "activityTypeId" uuid, CONSTRAINT "PK_3c9c305f3a63324608035932e20" PRIMARY KEY ("logId"))`);
        await queryRunner.query(`CREATE TABLE "config-rules" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "ruleId" uuid NOT NULL DEFAULT uuid_generate_v4(), "ruleName" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "UQ_aafdeabf03eee5d4ec30674f3bb" UNIQUE ("ruleName"), CONSTRAINT "PK_b51ff76506f61feb561a14f40d3" PRIMARY KEY ("ruleId"))`);
        await queryRunner.query(`CREATE TABLE "report-thresholds" ("dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP DEFAULT now(), "dateDeleted" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reportCount" integer NOT NULL DEFAULT '0', "name" character varying, "description" text, CONSTRAINT "UQ_43d760bb8a24eb01a0cd85e11a8" UNIQUE ("reportCount"), CONSTRAINT "UQ_ac6889a6a2edfb0eefd89ef8008" UNIQUE ("name"), CONSTRAINT "PK_d2da379108989264504c4e13e34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fraud_numbers" ADD CONSTRAINT "FK_864273a141af4569c246fb5e03b" FOREIGN KEY ("riskLevelId") REFERENCES "risk-levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_cases" ADD CONSTRAINT "FK_cfdb3a89f0f10af001f8a08b3b8" FOREIGN KEY ("reportPlatFormId") REFERENCES "report-platforms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_cases" ADD CONSTRAINT "FK_b1d22d5da2250648b1a6b81b312" FOREIGN KEY ("caseFileCaseId") REFERENCES "case_files"("caseId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_cases" ADD CONSTRAINT "FK_e2f42df0c068cf54ca50c6fd7a4" FOREIGN KEY ("fraudNumberFraudNumberId") REFERENCES "fraud_numbers"("fraudNumberId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case-comments" ADD CONSTRAINT "FK_d29aa020553b8d98103460a8cb7" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case-comments" ADD CONSTRAINT "FK_7154358811e424425284a0b8384" FOREIGN KEY ("caseFileCaseId") REFERENCES "case_files"("caseId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case_files" ADD CONSTRAINT "FK_34efab49ae7b69462f86424c42a" FOREIGN KEY ("statusStatusId") REFERENCES "case-statuses"("statusId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case_files" ADD CONSTRAINT "FK_b30dce4efb4e7b829decd4fa823" FOREIGN KEY ("investigatorUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity-logs" ADD CONSTRAINT "FK_290e9b89530954c767071186fa5" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity-logs" ADD CONSTRAINT "FK_22ffd065bdf013d8b41e2bd6a01" FOREIGN KEY ("activityTypeId") REFERENCES "activity-log-types"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity-logs" DROP CONSTRAINT "FK_22ffd065bdf013d8b41e2bd6a01"`);
        await queryRunner.query(`ALTER TABLE "activity-logs" DROP CONSTRAINT "FK_290e9b89530954c767071186fa5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "case_files" DROP CONSTRAINT "FK_b30dce4efb4e7b829decd4fa823"`);
        await queryRunner.query(`ALTER TABLE "case_files" DROP CONSTRAINT "FK_34efab49ae7b69462f86424c42a"`);
        await queryRunner.query(`ALTER TABLE "case-comments" DROP CONSTRAINT "FK_7154358811e424425284a0b8384"`);
        await queryRunner.query(`ALTER TABLE "case-comments" DROP CONSTRAINT "FK_d29aa020553b8d98103460a8cb7"`);
        await queryRunner.query(`ALTER TABLE "report_cases" DROP CONSTRAINT "FK_e2f42df0c068cf54ca50c6fd7a4"`);
        await queryRunner.query(`ALTER TABLE "report_cases" DROP CONSTRAINT "FK_b1d22d5da2250648b1a6b81b312"`);
        await queryRunner.query(`ALTER TABLE "report_cases" DROP CONSTRAINT "FK_cfdb3a89f0f10af001f8a08b3b8"`);
        await queryRunner.query(`ALTER TABLE "fraud_numbers" DROP CONSTRAINT "FK_864273a141af4569c246fb5e03b"`);
        await queryRunner.query(`DROP TABLE "report-thresholds"`);
        await queryRunner.query(`DROP TABLE "config-rules"`);
        await queryRunner.query(`DROP TABLE "activity-logs"`);
        await queryRunner.query(`DROP TABLE "activity-log-types"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "case_files"`);
        await queryRunner.query(`DROP TABLE "case-statuses"`);
        await queryRunner.query(`DROP TABLE "case-comments"`);
        await queryRunner.query(`DROP TABLE "report_cases"`);
        await queryRunner.query(`DROP TABLE "report-platforms"`);
        await queryRunner.query(`DROP TABLE "fraud_numbers"`);
        await queryRunner.query(`DROP TABLE "risk-levels"`);
    }

}
