"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
import { Input } from "@/components/ui/input";

const storage = getStorage();

interface Post {
  id: string;
  text: string;
  userEmail: string;
  username?: string;
  imageUrl?: string;
}

export default function RedditClone() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);

  // Fetch username from Firestore
  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUsername(docSnap.data().username || null);
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };
    fetchUsername();
  }, [user]);

  // Fetch posts in real-time
  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post)));
    });
    return () => unsubscribe();
  }, []);

  const uploadImage = async (imageFile: File | null) => {
    if (!imageFile) return "";
    
    const imageRef = ref(storage, `posts/${Date.now()}-${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef);
  };

  const addPost = async () => {
    if (!newPost.trim() || !user) return;

    const imageUrl = image ? await uploadImage(image) : "";
    await addDoc(collection(db, "posts"), {
      text: newPost,
      userEmail: user.email,
      username: username || user.email, // Store username if available, otherwise use email
      imageUrl,
    });

    setNewPost("");
    setImage(null);
  };

  const startEdit = (post: Post) => {
    setEditingPost(post.id);
    setEditText(post.text);
  };

  const saveEdit = async () => {
    if (!editingPost) return;
    const imageUrl = editImage ? await uploadImage(editImage) : undefined;
    const updateData: Partial<Post> = { text: editText };
    if (imageUrl) updateData.imageUrl = imageUrl;
    await updateDoc(doc(db, "posts", editingPost), updateData);
    setEditingPost(null);
    setEditText("");
    setEditImage(null);
  };

  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, "posts", postId));
  };

  return (
    <div className="max-w-2xl min-w-xl mx-auto p-4">
      <div className="mb-4 flex flex-col space-y-2">
        <input
          className="p-2 border rounded"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
        />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <Button onClick={addPost} className="ml-2">Post</Button>
      </div>
      <div>
        {posts.map((post) => (
          <Card key={post.id} className="mb-4 bg-secondary/50   ">
            <CardContent>
              <p><strong>{post.username || post.userEmail} posted:</strong></p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {post.imageUrl && <img src={post.imageUrl} alt="Post Image" className="w-full h-auto rounded" />}
              {editingPost === post.id ? (
                <>
                  <Input
                    className="flex-grow p-1 border rounded mt-2"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files?.[0] || null)} />
                  <Button onClick={saveEdit} className="bg-green-500 mt-2">Save</Button>
                </>
              ) : (
                <p>{post.text}</p>
              )}
              {user?.email === post.userEmail && !editingPost && (
                <div className="flex space-x-2 mt-2">
                  <Button onClick={() => startEdit(post)} className="bg-blue-500">Edit</Button>
                  <Button onClick={() => deletePost(post.id)} className="bg-red-500">Delete</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
