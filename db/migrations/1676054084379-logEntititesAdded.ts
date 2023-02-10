import { MigrationInterface, QueryRunner } from "typeorm";

export class logEntititesAdded1676054084379 implements MigrationInterface {
    name = 'logEntititesAdded1676054084379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "deletedAt"`);
    }

}
