export function useFileUpload() {
  return async (filename: string, file: File) => {
    try {
      // Get the signed URL from our API
      const result = await fetch(`/api/files/upload-url?file=${encodeURIComponent(filename)}`, {
        method: 'POST',
      });
      
      if (!result.ok) {
        console.error('Failed to get upload URL:', await result.text());
        return false;
      }
      
      const { url, fields } = await result.json();
      
      // Upload the file directly to Google Cloud Storage
      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      
      const upload = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      if (!upload.ok) {
        console.error('Upload failed:', await upload.text());
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in file upload:', error);
      return false;
    }
  };
}