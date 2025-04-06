/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  query,
  onSnapshot,
  getDoc,
  serverTimestamp,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ImageIcon,
  SendIcon,
  // PaperPlaneIcon,
  Loader2,
  Trash2Icon,
} from "lucide-react";
import { format } from "date-fns";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  text: string;
  userEmail: string;
  username?: string;
  imageUrl?: string;
  createdAt?: any;
}

export default function SpecialAbledChat() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [isSpeciallyAbled, setIsSpeciallyAbled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const uploadFile = useFileUpload();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUsername(docSnap.data().username || null);
            setIsSpeciallyAbled(docSnap.data().speciallyAbled || false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (isSpeciallyAbled) {
      const q = query(
        collection(db, "special_abled_chat"),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post))
        );
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isSpeciallyAbled]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const uploadImage = async (imageFile: File | null) => {
    if (!imageFile) return "";
    
    try {
      const filename = `special_abled_chat_${Date.now()}_${imageFile.name}`;
      const success = await uploadFile(filename, imageFile);
      
      if (success) {
        // Make sure the bucket is public or has appropriate CORS settings
        const bucketName = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME || "site-data-stoa";
        return `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(filename)}`;
      } else {
        console.error("Failed to upload image");
        return "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const addPost = async () => {
    if (!newPost.trim() || !user || !isSpeciallyAbled) return;
    try {
      setIsSubmitting(true);
      const imageUrl = image ? await uploadImage(image) : "";
      await addDoc(collection(db, "special_abled_chat"), {
        text: newPost,
        userEmail: user.email,
        username: username || user.email,
        imageUrl,
        createdAt: serverTimestamp(),
      });
      setNewPost("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "special_abled_chat", postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isSpeciallyAbled) {
    return (
      <Card className="max-w-2xl mx-auto mt-8 p-6 text-center ">
        <CardContent>
          <div className="py-8">
            <h1 className="text-2xl font-semibold mb-4">ComfortHub</h1>
            <p className="text-gray-500">
              This chat space is exclusively available for specially abled
              users.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">ComfortHub</h1>
      <p className="text-center text-gray-500 mb-6">
        A safe space to connect and share with others
      </p>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <Textarea
            className="resize-none min-h-24"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts here..."
            disabled={isSubmitting}
          />

          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded-md max-h-64 object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4">
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                id="image-upload"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              <Button variant="outline" className="flex gap-2" type="button">
                <ImageIcon size={16} />
                <span>Add Image</span>
              </Button>
            </div>

            <Button
              onClick={addPost}
              className="ml-auto flex gap-2"
              disabled={!newPost.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon size={16} />
              )}
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {posts.length === 0 && !isLoading ? (
        <div className="text-center py-12 text-gray-500">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="mb-4 overflow-hidden border-2 border-primary/5">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="font-medium">
                    {post.username || post.userEmail}
                  </div>
                  {user && user.email === post.userEmail && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletePostId(post.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  )}
                </div>
                {post.createdAt && (
                  <div className="text-xs text-gray-500">
                    {post.createdAt.toDate
                      ? format(post.createdAt.toDate(), "MMM d, yyyy • h:mm a")
                      : "Just now"}
                  </div>
                )}
              </CardHeader>

              {post.imageUrl && (
                <div className="px-6 relative w-full h-64 my-2">
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full h-full rounded-md object-contain"
                  />
                </div>
              )}

              <CardContent className="py-4">
                <p className="whitespace-pre-wrap">{post.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deletePostId) {
                  deletePost(deletePostId);
                  setDeletePostId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
