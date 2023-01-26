import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationTest21674759967496 implements MigrationInterface {
    name = 'migrationTest21674759967496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "FK_b996e1ca94a67ce71c3229244f4"`);
        await queryRunner.query(`CREATE TABLE "permission_roles" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_26874dd04321485501febac2334" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2ed76a7ef2fa565d019403a24f" ON "permission_roles" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86f6c7d1a377b78cef67a3c3d2" ON "permission_roles" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "PK_e976807ebe4fc773c2365d91566"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "PK_790a8ca58c37fd1f31944ae65e2" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "PK_790a8ca58c37fd1f31944ae65e2"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "PK_3c44e4995bfd3c6bed8b7cea31a" PRIMARY KEY ("userId", "roleId")`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "FK_0f8e670ccb734647c659d30b766"`);
        await queryRunner.query(`ALTER TABLE "role_users" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_users" ALTER COLUMN "roleId" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_b996e1ca94a67ce71c3229244f" ON "role_users" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f8e670ccb734647c659d30b76" ON "role_users" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "FK_b996e1ca94a67ce71c3229244f4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "FK_0f8e670ccb734647c659d30b766" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_roles" ADD CONSTRAINT "FK_2ed76a7ef2fa565d019403a24f9" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permission_roles" ADD CONSTRAINT "FK_86f6c7d1a377b78cef67a3c3d23" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission_roles" DROP CONSTRAINT "FK_86f6c7d1a377b78cef67a3c3d23"`);
        await queryRunner.query(`ALTER TABLE "permission_roles" DROP CONSTRAINT "FK_2ed76a7ef2fa565d019403a24f9"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "FK_0f8e670ccb734647c659d30b766"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "FK_b996e1ca94a67ce71c3229244f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f8e670ccb734647c659d30b76"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b996e1ca94a67ce71c3229244f"`);
        await queryRunner.query(`ALTER TABLE "role_users" ALTER COLUMN "roleId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_users" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "FK_0f8e670ccb734647c659d30b766" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "PK_3c44e4995bfd3c6bed8b7cea31a"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "role_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "PK_790a8ca58c37fd1f31944ae65e2" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "PK_790a8ca58c37fd1f31944ae65e2"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "PK_e976807ebe4fc773c2365d91566" PRIMARY KEY ("user_id", "role_id")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86f6c7d1a377b78cef67a3c3d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ed76a7ef2fa565d019403a24f"`);
        await queryRunner.query(`DROP TABLE "permission_roles"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "FK_b996e1ca94a67ce71c3229244f4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
