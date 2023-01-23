import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigrations1674496676798 implements MigrationInterface {
    name = 'newMigrations1674496676798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('MASCULINO', 'FEMENINO')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "curp" character varying(191) NOT NULL, "name" character varying(191) NOT NULL, "first_name" character varying(191) NOT NULL, "last_name" character varying(191), "avatar" character varying(255), "gender" "public"."user_gender_enum" NOT NULL, "acronym" character varying(3), "birthday" TIMESTAMP NOT NULL, "zip_code" character varying(191) NOT NULL, "country_id" integer NOT NULL, "state_id" integer NOT NULL, "city_id" integer NOT NULL, "neighborhood" character varying(191) NOT NULL, "street" character varying(255) NOT NULL, "house_number" character varying(191) NOT NULL, "suit_number" character varying(191), "email" character varying(255) NOT NULL, "phone_numer" character varying(191) NOT NULL, "password" character varying(255) NOT NULL, "order" integer, "active" boolean NOT NULL, "hashedRT" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_3447b7d74f1cf55aab20e68dc14" UNIQUE ("curp"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying, "route" character varying, "active" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    }

}
