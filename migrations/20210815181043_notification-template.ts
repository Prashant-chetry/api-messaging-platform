import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable(
    'notification-template',
    (t: Knex.CreateTableBuilder) => {
      t.uuid('id').primary();
      t.string('type').notNullable().index();
      t.string('action').index().notNullable();
      t.string('module').index().notNullable();
      t.text('body').notNullable();
      t.text('subject').notNullable();
      t.text('text').notNullable();
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('notification-template');
}
