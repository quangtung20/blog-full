import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1646563316724 implements MigrationInterface {
    name = 'UserMigration1646563316724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "public_id" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_9ce228304ac3d555798e1953ad1" UNIQUE ("public_id"), CONSTRAINT "PK_9ef289d84b9ec2c4fdbdc28d440" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("_id" SERIAL NOT NULL, "product_id" character varying NOT NULL, "title" character varying NOT NULL, "price" integer NOT NULL, "description" character varying NOT NULL, "content" character varying NOT NULL, "checked" boolean NOT NULL DEFAULT false, "sold" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "images_id" uuid, "category_id" integer, CONSTRAINT "UQ_1de6a4421ff0c410d75af27aeee" UNIQUE ("product_id"), CONSTRAINT "REL_1974264ea7265989af8392f63a" UNIQUE ("images_id"), CONSTRAINT "PK_48a340498988303028eec5c4c4f" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("_id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_0d6721292a14c4041a79fb021fb" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "paymentId" character varying NOT NULL, "address" character varying NOT NULL, "status" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "user_id" uuid, CONSTRAINT "PK_95f581c077b30fbddd4374806b6" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "user" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("_id" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "total" integer NOT NULL DEFAULT '0', "product_id" integer, "user_id" uuid, CONSTRAINT "REL_dccd1ec2d6f5644a69adf163bc" UNIQUE ("product_id"), CONSTRAINT "PK_ec117221695fb740d8cb2f04868" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1974264ea7265989af8392f63a1" FOREIGN KEY ("images_id") REFERENCES "image"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_dccd1ec2d6f5644a69adf163bc1" FOREIGN KEY ("product_id") REFERENCES "product"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_dccd1ec2d6f5644a69adf163bc1"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1974264ea7265989af8392f63a1"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
