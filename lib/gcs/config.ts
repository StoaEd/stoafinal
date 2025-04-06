import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

// Your GCS bucket name
const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'your-bucket-name';
const bucket = storage.bucket(bucketName);

export { storage, bucket, bucketName };