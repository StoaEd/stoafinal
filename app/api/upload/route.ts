import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
// Remove useAuth import
// import { auth } from '@/lib/firebase/firebase';
// Import admin SDK if needed for server-side auth
// import { getAuth } from 'firebase-admin/auth';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }
});

const bucketName = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME || 'site-data-stoa';

export async function POST(request: NextRequest) {
  try {
    // Don't use useAuth hook here - it's not valid in server components/API routes
    // Instead, verify authentication using token from headers or cookies
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;
    
    if (!file || !filename) {
      return NextResponse.json({ error: 'File and filename are required' }, { status: 400 });
    }
    
    // Create a unique filename
    const uniqueFilename = `special_abled_chat/${Date.now()}-${filename}`;
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Google Cloud Storage
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(uniqueFilename);
    
    await blob.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      }
    });
    
    // Make the file publicly accessible
    await blob.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFilename}`;
    
    return NextResponse.json({ url: publicUrl });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}