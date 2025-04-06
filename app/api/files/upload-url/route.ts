import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export async function POST(request: Request) {
  // Get the filename from the URL
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('file');
  
  if (!filename) {
    return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
  }

  try {
    const storage = new Storage({
      projectId: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });

    const bucket = storage.bucket(process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME || "site-data-stoa");
    const file = bucket.file(filename);
    
    const options = {
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      fields: { "x-goog-meta-source": "ornate-flame-450707-t7" },
    };
    
    const [response] = await file.generateSignedPostPolicyV4(options);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
