import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'audit-logs',
    (table: Knex.CreateTableBuilder) => {
      table.uuid('id').primary();
      table.string('table_name').notNullable().index();
      table.uuid('table_uuid').notNullable();
      table.uuid('user').notNullable();
      table.jsonb('old_data');
      table.jsonb('new_data');
      table.text('event').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('audit-logs');
}
