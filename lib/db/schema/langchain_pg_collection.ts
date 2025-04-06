import { index, pgTable, varchar, uuid, json } from 'drizzle-orm/pg-core';

export const langchain_pg_collection = pgTable(
  'langchain_pg_collection',
  {
    uuid: uuid('uuid').primaryKey(),
    name: varchar('name').notNull(),
    cmetadata: json('cmetadata'),
  },
  table => ({
    primaryKeyIndex: index('langchain_pg_collection_pkey')
      .on(table.uuid),
  }),
);