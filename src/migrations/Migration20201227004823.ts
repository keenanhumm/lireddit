import { Migration } from '@mikro-orm/migrations';

export class Migration20201227004823 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "area" ("id" int4 not null, "user_id" int4 not null, "name" text not null);');
    this.addSql('alter table "area" add constraint "area_pkey" primary key ("id", "user_id");');

    this.addSql('create table "performance" ("id" serial primary key, "area_id" int4 not null, "user_id" int4 not null, "rating" int4 not null, "day" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('drop table if exists "post" cascade;');
  }

}
