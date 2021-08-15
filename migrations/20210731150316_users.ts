import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: Knex.CreateTableBuilder) => {
    table.primary(['id']).uuid('id');
    table.string('email').notNullable().index();
    table.string('mobile_number').index();
    table.string('mobile_code');
    table.string('first_name').notNullable();
    table.string('middle_name').nullable();
    table.string('last_name').notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('account_verified').notNullable().defaultTo(false);
    table.string('keycloak_id').unique().index();
    table.string('welcome_mail_sent').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.jsonb('data');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
