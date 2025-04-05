'use server';

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

export const createResource = async (input: NewResourceParams) => {
  try {
    // Debug connection string (don't include this in production)
    console.log('DB Connection check - using connection string format:', 
      process.env.DATABASE_URL?.replace(/:\/\/.*@/, '://[CREDENTIALS_HIDDEN]@'));
    
    const { content } = insertResourceSchema.parse(input);
    console.log('embedded....');
    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      })),
    );
    console.log('Resource successfully created and embedded.');
    return 'Resource successfully created and embedded.';
  } catch (error) {
    console.error('Error creating resource:', error);
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};