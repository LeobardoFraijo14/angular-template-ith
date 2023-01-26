import { MigrationInterface, QueryRunner } from "typeorm";

export class migration11674763438454 implements MigrationInterface {
    name = 'migration11674763438454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(191) NOT NULL, "avatar" character varying(255), "email" character varying(191) NOT NULL, "password" character varying(255) NOT NULL, "suborganismId" integer, "createdBy" integer, "hashedRT" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying, "route" character varying, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying, "route" character varying, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_users" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_3c44e4995bfd3c6bed8b7cea31a" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b996e1ca94a67ce71c3229244f" ON "role_users" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f8e670ccb734647c659d30b76" ON "role_users" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "permission_roles" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_26874dd04321485501febac2334" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2ed76a7ef2fa565d019403a24f" ON "permission_roles" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86f6c7d1a377b78cef67a3c3d2" ON "permission_roles" ("permissionId") `);
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
        await queryRunner.query(`DROP INDEX "public"."IDX_86f6c7d1a377b78cef67a3c3d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ed76a7ef2fa565d019403a24f"`);
        await queryRunner.query(`DROP TABLE "permission_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f8e670ccb734647c659d30b76"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b996e1ca94a67ce71c3229244f"`);
        await queryRunner.query(`DROP TABLE "role_users"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
