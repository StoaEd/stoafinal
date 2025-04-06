import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { useAuth } from "@/lib/firebase/hooks/useAuth";


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
    // Check if the user is authenticated

    const user = useAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    
    // Get form data with the file
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Create a unique filename
    const filename = `special_abled_chat/${Date.now()}-${file.name}`;
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Google Cloud Storage
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(filename);
    
    await blob.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      }
    });
    
    // Make the file publicly accessible
    await blob.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    
    return NextResponse.json({ url: publicUrl });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}