import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('messages', (t: Knex.CreateTableBuilder) => {
    t.uuid('id').primary();
    t.uuid('from').notNullable().index();
    t.uuid('to').notNullable().index();
    t.text('message').notNullable();
    t.boolean('is_read').defaultTo(false);
    t.boolean('is_sent').defaultTo(false);
    t.boolean('is_delivered').defaultTo(false);
    t.jsonb('data');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('messages');
}
