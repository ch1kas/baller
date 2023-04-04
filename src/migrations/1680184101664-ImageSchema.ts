import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageSchema1680184101664 implements MigrationInterface {
    name = 'ImageSchema1680184101664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image_entity" ("id" SERIAL NOT NULL, "original_url" character varying NOT NULL, "categoryId" uuid, "productId" uuid, CONSTRAINT "REL_7175d6b0d6d562097f11f17e66" UNIQUE ("categoryId"), CONSTRAINT "REL_b639bbe2d5f1d4090e81ebc150" UNIQUE ("productId"), CONSTRAINT "PK_fb554818daabc01db00d67aafde" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "image_entity" ADD CONSTRAINT "FK_7175d6b0d6d562097f11f17e660" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image_entity" ADD CONSTRAINT "FK_b639bbe2d5f1d4090e81ebc1505" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_entity" DROP CONSTRAINT "FK_b639bbe2d5f1d4090e81ebc1505"`);
        await queryRunner.query(`ALTER TABLE "image_entity" DROP CONSTRAINT "FK_7175d6b0d6d562097f11f17e660"`);
        await queryRunner.query(`DROP TABLE "image_entity"`);
    }

}
