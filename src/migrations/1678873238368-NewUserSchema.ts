import {MigrationInterface, QueryRunner} from "typeorm";

export class NewUserSchema1678873238368 implements MigrationInterface {
    name = 'NewUserSchema1678873238368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expired_access_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_04259d7ed505a721a81f74a07ab" UNIQUE ("token"), CONSTRAINT "PK_10798a01b70c12c8fada80fe3fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expired_access_tokens" ADD CONSTRAINT "FK_dd214c76e3544048c4dd4f29ca4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expired_access_tokens" DROP CONSTRAINT "FK_dd214c76e3544048c4dd4f29ca4"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`DROP TABLE "expired_access_tokens"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
