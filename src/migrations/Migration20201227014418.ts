import { Migration } from '@mikro-orm/migrations';

export class Migration20201227014418 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_area" ("id" serial primary key, "user_id" int4 not null, "name" text not null);');

    this.addSql('drop table if exists "area" cascade;');
  }

}
