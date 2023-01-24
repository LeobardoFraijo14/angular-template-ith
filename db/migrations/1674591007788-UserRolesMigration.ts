import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRolesMigration1674591007788 implements MigrationInterface {
    name = 'UserRolesMigration1674591007788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1dc3ce23874f906d8306186671"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_790a8ca58c37fd1f31944ae65e"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE INDEX "IDX_1dc3ce23874f906d8306186671" ON "role_users" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_790a8ca58c37fd1f31944ae65e" ON "role_users" ("role_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_790a8ca58c37fd1f31944ae65e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1dc3ce23874f906d8306186671"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE INDEX "IDX_790a8ca58c37fd1f31944ae65e" ON "role_users" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1dc3ce23874f906d8306186671" ON "role_users" ("user_id") `);
    }

}
