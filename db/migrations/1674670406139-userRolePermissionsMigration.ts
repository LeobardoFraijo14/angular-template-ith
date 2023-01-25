import { MigrationInterface, QueryRunner } from "typeorm";

export class userRolePermissionsMigration1674670406139 implements MigrationInterface {
    name = 'userRolePermissionsMigration1674670406139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying, "route" character varying, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(191) NOT NULL, "avatar" character varying(255), "email" character varying(191) NOT NULL, "password" character varying(255) NOT NULL, "suborganismId" integer, "createdBy" integer, "hashedRT" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying, "route" character varying, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_users" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_e976807ebe4fc773c2365d91566" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE INDEX "IDX_1dc3ce23874f906d8306186671" ON "role_users" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_790a8ca58c37fd1f31944ae65e" ON "role_users" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "FK_1dc3ce23874f906d8306186671a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD CONSTRAINT "FK_790a8ca58c37fd1f31944ae65e2" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "FK_790a8ca58c37fd1f31944ae65e2"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP CONSTRAINT "FK_1dc3ce23874f906d8306186671a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_790a8ca58c37fd1f31944ae65e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1dc3ce23874f906d8306186671"`);
        await queryRunner.query(`ALTER TABLE "role_users" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "role_users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`DROP TABLE "role_users"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
