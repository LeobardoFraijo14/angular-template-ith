import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTest11674505455151 implements MigrationInterface {
    name = 'MigrationTest11674505455151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" ALTER COLUMN "active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" ALTER COLUMN "active" DROP DEFAULT`);
    }

}
