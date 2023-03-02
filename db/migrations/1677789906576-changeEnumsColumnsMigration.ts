import { MigrationInterface, QueryRunner } from "typeorm";

export class changeEnumsColumnsMigration1677789906576 implements MigrationInterface {
    name = 'changeEnumsColumnsMigration1677789906576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "catalogue"`);
        await queryRunner.query(`DROP TYPE "public"."logs_catalogue_enum"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "catalogue" character varying`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "movement"`);
        await queryRunner.query(`DROP TYPE "public"."logs_movement_enum"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "movement" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "movement"`);
        await queryRunner.query(`CREATE TYPE "public"."logs_movement_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11')`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "movement" "public"."logs_movement_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "catalogue"`);
        await queryRunner.query(`CREATE TYPE "public"."logs_catalogue_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "catalogue" "public"."logs_catalogue_enum" NOT NULL`);
    }

}
