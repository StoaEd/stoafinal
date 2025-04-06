import type { NextApiRequest, NextApiResponse } from "next";
import { SignedPostPolicyV4Output } from "@google-cloud/storage";
import { Storage } from "@google-cloud/storage";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SignedPostPolicyV4Output | string>
) {
    const { query, method } = req;
    if (method !== "POST") {
        res.status(405).json("Method not allowed");
        return;
    }
    const storage = new Storage({
        projectId: process.env.PROJECT_ID,  // Google Cloud project ID from environment variables
        credentials: {
            client_email: process.env.CLIENT_EMAIL,  // Service account email from environment variables
            private_key: process.env.PRIVATE_KEY,    // Service account private key from environment variables
        },
    });
    
    // Get a reference to the target storage bucket
    const bucket = storage.bucket(process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME || "site-data-stoa");
    
    // Create a reference to the target file using the filename passed in the query parameter
    const file = bucket.file(query.file as string);
    
    // Options for the signed URL:
    // - expires: URL is valid for 5 minutes
    // - fields: additional metadata to attach to the upload
    const options = {
        expires: Date.now() + 5 * 60 * 1000, //  5 minutes,
        fields: { "x-goog-meta-source": "ornate-flame-450707-t7" },
    };
    
    // Generate the signed policy that allows direct upload
    const [response] = await file.generateSignedPostPolicyV4(options);
    
    // Return the signed policy to the client
    res.status(200).json(response);
}