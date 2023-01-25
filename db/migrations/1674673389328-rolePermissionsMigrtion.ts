import { MigrationInterface, QueryRunner } from "typeorm";

export class rolePermissionsMigrtion1674673389328 implements MigrationInterface {
    name = 'rolePermissionsMigrtion1674673389328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1dc3ce23874f906d8306186671"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_790a8ca58c37fd1f31944ae65e"`);
        await queryRunner.query(`CREATE TABLE "permission_roles" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_0a8c5ef722edb01ee0d27acdf08" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE INDEX "IDX_1dc3ce23874f906d8306186671" ON "role_users" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_790a8ca58c37fd1f31944ae65e" ON "role_users" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e07d497132709affeef715a2b6" ON "permission_roles" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9173e2102ae416a0d07b0c574f" ON "permission_roles" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "permission_roles" ADD CONSTRAINT "FK_e07d497132709affeef715a2b60" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_roles" ADD CONSTRAINT "FK_9173e2102ae416a0d07b0c574fc" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission_roles" DROP CONSTRAINT "FK_9173e2102ae416a0d07b0c574fc"`);
        await queryRunner.query(`ALTER TABLE "permission_roles" DROP CONSTRAINT "FK_e07d497132709affeef715a2b60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9173e2102ae416a0d07b0c574f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e07d497132709affeef715a2b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_790a8ca58c37fd1f31944ae65e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1dc3ce23874f906d8306186671"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`DROP TABLE "permission_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_790a8ca58c37fd1f31944ae65e" ON "role_users" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1dc3ce23874f906d8306186671" ON "role_users" ("user_id") `);
    }

}
