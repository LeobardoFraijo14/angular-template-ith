import { MigrationInterface, QueryRunner } from "typeorm";

export class enumMigration1676393956222 implements MigrationInterface {
    name = 'enumMigration1676393956222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."logs_movement_enum" RENAME TO "logs_movement_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."logs_movement_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11')`);
        await queryRunner.query(`ALTER TABLE "logs" ALTER COLUMN "movement" TYPE "public"."logs_movement_enum" USING "movement"::"text"::"public"."logs_movement_enum"`);
        await queryRunner.query(`DROP TYPE "public"."logs_movement_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."logs_movement_enum_old" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8')`);
        await queryRunner.query(`ALTER TABLE "logs" ALTER COLUMN "movement" TYPE "public"."logs_movement_enum_old" USING "movement"::"text"::"public"."logs_movement_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."logs_movement_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."logs_movement_enum_old" RENAME TO "logs_movement_enum"`);
    }

}
