import { MigrationInterface, QueryRunner } from "typeorm";

export class groupMigration1675378384008 implements MigrationInterface {
    name = 'groupMigration1675378384008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying, "active" boolean NOT NULL DEFAULT true, "order" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "groupId" integer`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_3ef2f3921bb8b09c16b21e197f4" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_3ef2f3921bb8b09c16b21e197f4"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "groupId"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
