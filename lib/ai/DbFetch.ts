import { google } from '@ai-sdk/google';
import { embed } from 'ai';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { python_embeddings } from '../db/schema/python_embeddings';
import { db } from '../db';

const embeddingModel = google.textEmbeddingModel('gemini-embedding-exp-03-07',{
    outputDimensionality: 1536,});
  
// const generateChunks = (input: string): string[] => {
// return input
//     .trim()
//     .split('.')
//     .filter(i => i !== '');
// };

export const generateEmbedding = async (value: string): Promise<number[]> => {
const input = value.replaceAll('\\n', ' ');
const { embedding } = await embed({
    model: embeddingModel,
    value: input,
});
return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    python_embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: python_embeddings.document, similarity })
    .from(python_embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(10);

  console.log(similarGuides);
  return similarGuides; 
};