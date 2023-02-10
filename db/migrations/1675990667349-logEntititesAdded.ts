import { MigrationInterface, QueryRunner } from "typeorm";

export class logEntititesAdded1675990667349 implements MigrationInterface {
    name = 'logEntititesAdded1675990667349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."logs_catalogue_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TYPE "public"."logs_movement_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8')`);
        await queryRunner.query(`CREATE TABLE "logs" ("id" SERIAL NOT NULL, "date" date NOT NULL DEFAULT now(), "registerId" character varying NOT NULL, "catalogue" "public"."logs_catalogue_enum" NOT NULL, "movement" "public"."logs_movement_enum" NOT NULL, "oldInfo" character varying, "isActive" boolean NOT NULL DEFAULT true, "newInfo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "FK_a1196a1956403417fe3a0343390" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_a1196a1956403417fe3a0343390"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`DROP TYPE "public"."logs_movement_enum"`);
        await queryRunner.query(`DROP TYPE "public"."logs_catalogue_enum"`);
    }

}
