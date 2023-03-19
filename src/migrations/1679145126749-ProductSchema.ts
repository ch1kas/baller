import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductSchema1679145126749 implements MigrationInterface {
    name = 'ProductSchema1679145126749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "posts_count" TO "product_count"`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "numeric_size" integer, "letter_size" character varying, CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_categories_categories" ("productsId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_8fd95511a998d598ff66d500933" PRIMARY KEY ("productsId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_40e7da0284a5389344605de8da" ON "products_categories_categories" ("productsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1d833224b5be535323207473f" ON "products_categories_categories" ("categoriesId") `);
        await queryRunner.query(`CREATE TABLE "users_favorites_products" ("usersId" uuid NOT NULL, "productsId" uuid NOT NULL, CONSTRAINT "PK_40f21f7df7c163f36987fbf1829" PRIMARY KEY ("usersId", "productsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8aee8ad2a408c631001be82eeb" ON "users_favorites_products" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a08fdd35c8fbc59e57772db28" ON "users_favorites_products" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "products_categories_categories" ADD CONSTRAINT "FK_40e7da0284a5389344605de8dab" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories_categories" ADD CONSTRAINT "FK_e1d833224b5be535323207473f1" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_favorites_products" ADD CONSTRAINT "FK_8aee8ad2a408c631001be82eeb0" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_favorites_products" ADD CONSTRAINT "FK_0a08fdd35c8fbc59e57772db28d" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_favorites_products" DROP CONSTRAINT "FK_0a08fdd35c8fbc59e57772db28d"`);
        await queryRunner.query(`ALTER TABLE "users_favorites_products" DROP CONSTRAINT "FK_8aee8ad2a408c631001be82eeb0"`);
        await queryRunner.query(`ALTER TABLE "products_categories_categories" DROP CONSTRAINT "FK_e1d833224b5be535323207473f1"`);
        await queryRunner.query(`ALTER TABLE "products_categories_categories" DROP CONSTRAINT "FK_40e7da0284a5389344605de8dab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a08fdd35c8fbc59e57772db28"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8aee8ad2a408c631001be82eeb"`);
        await queryRunner.query(`DROP TABLE "users_favorites_products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1d833224b5be535323207473f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40e7da0284a5389344605de8da"`);
        await queryRunner.query(`DROP TABLE "products_categories_categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "product_count" TO "posts_count"`);
    }

}
