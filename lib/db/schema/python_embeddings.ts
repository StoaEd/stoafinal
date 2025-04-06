import { index, pgTable, varchar, vector, uuid, json } from 'drizzle-orm/pg-core';

// Assuming this table exists elsewhere in your schema
// If not, you'll need to create it
import { langchain_pg_collection } from './langchain_pg_collection';

export const python_embeddings = pgTable(
  'python_embeddings',
  {
    uuid: uuid('uuid').primaryKey(),
    collection_id: uuid('collection_id').references(
      () => langchain_pg_collection.uuid,
      { onDelete: 'cascade' },
    ),
    embedding: vector('embedding',{dimensions: 768}), // Note: dimensions not specified - add value if known
    document: varchar('document'),
    cmetadata: json('cmetadata'),
    custom_id: varchar('custom_id'),
  },
  table => ({
    // primaryKeyIndex: index('langchain_pg_embedding_pkey')
    //   .using('btree')
    //   .on(table.uuid)
    //   .unique(),
    // Add vector similarity search index
    embeddingIndex: index('python_embedding_vector_idx').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
);