import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1676058269971 implements MigrationInterface {
    name = 'initialMigration1676058269971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logs" ("id" SERIAL NOT NULL, "date" date NOT NULL DEFAULT now(), "registerId" character varying NOT NULL, "catalogue" "public"."logs_catalogue_enum" NOT NULL, "movement" "public"."logs_movement_enum" NOT NULL, "oldInfo" character varying, "isActive" boolean NOT NULL DEFAULT true, "newInfo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(191) NOT NULL, "firstName" character varying(191) NOT NULL, "secondName" character varying(191), "avatar" character varying(255), "email" character varying(191) NOT NULL, "password" character varying(255) NOT NULL, "suborganismId" integer, "createdBy" integer, "hashedRT" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_users" ("id" SERIAL NOT NULL, "roleId" integer NOT NULL, "userId" integer NOT NULL, "is_active" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_6b4286b64efea084922d1c709bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "order" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE ("name"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "route" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "groupId" integer, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_roles" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL, "roleId" integer NOT NULL, "permissionId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_1c354345d93728c25adca19d717" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying, "route" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "FK_a1196a1956403417fe3a0343390" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "FK_0f8e670ccb734647c659d30b766" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "FK_b996e1ca94a67ce71c3229244f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_0ce20ad956af3961df1ff12d0c5" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_roles" ADD CONSTRAINT "FK_2ed76a7ef2fa565d019403a24f9" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_roles" ADD CONSTRAINT "FK_86f6c7d1a377b78cef67a3c3d23" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission_roles" DROP CONSTRAINT "FK_86f6c7d1a377b78cef67a3c3d23"`);
        await queryRunner.query(`ALTER TABLE "permission_roles" DROP CONSTRAINT "FK_2ed76a7ef2fa565d019403a24f9"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_0ce20ad956af3961df1ff12d0c5"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "FK_b996e1ca94a67ce71c3229244f4"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "FK_0f8e670ccb734647c659d30b766"`);
        await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_a1196a1956403417fe3a0343390"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permission_roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "role_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "logs"`);
    }

}
