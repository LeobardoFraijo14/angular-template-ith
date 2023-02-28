import { MigrationInterface, QueryRunner } from "typeorm";

export class organismTypeFieldAddedOnUsersEntity1677549004564 implements MigrationInterface {
    name = 'organismTypeFieldAddedOnUsersEntity1677549004564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "organismTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "job" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "job" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organismTypeId"`);
    }

}
