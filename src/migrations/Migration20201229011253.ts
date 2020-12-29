import { Migration } from '@mikro-orm/migrations';

export class Migration20201229011253 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_area" add column "is_active" bool not null;');
  }

}
