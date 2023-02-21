import { MigrationInterface, QueryRunner } from "typeorm";

export class updatedUserMigration1677013024174 implements MigrationInterface {
    name = 'updatedUserMigration1677013024174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "organismId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "job" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "job"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organismId"`);
    }

}
