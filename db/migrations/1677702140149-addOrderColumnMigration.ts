import { MigrationInterface, QueryRunner } from "typeorm";

export class addOrderColumnMigration1677702140149 implements MigrationInterface {
    name = 'addOrderColumnMigration1677702140149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" ADD "order" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "order" integer`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "order" integer`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "order" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "order"`);
    }

}
