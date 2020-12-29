import { Migration } from '@mikro-orm/migrations';

export class Migration20201227013700 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "area" rename column "id" to "_id";');
  }

}
