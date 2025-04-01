/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, doc, query, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
// import { Input } from "@/components/ui/input";

const storage = getStorage();

interface Post {
  id: string;
  text: string;
  userEmail: string;
  username?: string;
  imageUrl?: string;
}

export default function SpecialAbledChat() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [isSpeciallyAbled, setIsSpeciallyAbled] = useState<boolean>(false);

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
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (isSpeciallyAbled) {
      const q = query(collection(db, "special_abled_chat"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post)));
      });
      return () => unsubscribe();
    }
  }, [isSpeciallyAbled]);

  const uploadImage = async (imageFile: File | null) => {
    if (!imageFile) return "";
    const imageRef = ref(storage, `special_abled_chat/${Date.now()}-${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef);
  };

  const addPost = async () => {
    if (!newPost.trim() || !user || !isSpeciallyAbled) return;
    const imageUrl = image ? await uploadImage(image) : "";
    await addDoc(collection(db, "special_abled_chat"), {
      text: newPost,
      userEmail: user.email,
      username: username || user.email,
      imageUrl,
    });
    setNewPost("");
    setImage(null);
  };

  if (!isSpeciallyAbled) {
    return <p className="text-center text-gray-500 mt-4">This chat is only available for specially abled users.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 flex flex-col space-y-2">
        <input
          className="p-2 border rounded"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something..."
        />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <Button onClick={addPost} className="ml-2">Post</Button>
      </div>
      <div>
        {posts.map((post) => (
          <Card key={post.id} className="mb-4">
            <CardContent>
              <p><strong>{post.username || post.userEmail}:</strong></p>
              {post.imageUrl && <img src={post.imageUrl} alt="Post" className="w-full h-auto rounded" />}
              <p>{post.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
