import { MigrationInterface, QueryRunner } from "typeorm";

export class createdByAdditionMigration1677608498461 implements MigrationInterface {
    name = 'createdByAdditionMigration1677608498461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "permission_roles" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "created_by" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "permission_roles" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "created_by"`);
    }

}
