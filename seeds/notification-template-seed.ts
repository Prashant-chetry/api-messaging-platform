import { Knex } from 'knex';
import { v4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('notification-templates').del();

  // Inserts seed entries
  await knex('notification-templates').insert([
    {
      id: v4(),
      type: 'email',
      action: 'creation',
      module: 'users',
      body: '<b>Hi {{firstName}}</b><br/><p>Welcome to messaging-platform</p>',
      subject: 'welcome to messaging-platform',
      text: 'welcome to messaging-platform',
    },
    {
      id: v4(),
      type: 'sms',
      action: 'creation',
      module: 'users',
      body: 'Hi {{firstName}} Welcome to messaging-platform',
      subject: 'welcome to messaging-platform',
      text: 'welcome to messaging-platform',
    },
  ]);
}
