"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediumBackgroundPattern } from '@/components/ui/background-patterns/medium-background';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuthError = (error: AuthError) => {
    switch (error.code) {
      case 'auth/user-not-found':
        setError('No account found with this email');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password');
        break;
      case 'auth/email-already-in-use':
        setError('Email already registered');
        break;
      default:
        setError('Authentication failed. Please try again.');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp(),
      }, { merge: true });
      router.push('/dashboard');
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        isAdmin: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        username: '', // Add logic to set username if needed
        name: '', // Add logic to set name if needed
        passwordHash: '', // Add logic to set passwordHash if needed
        profilePic: '', // Add logic to set profilePic if needed
        subjectIds: [],
        noteIds: [],
        chatIds: [],
      });
      sessionStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to sign up. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <MediumBackgroundPattern/>
      <div className="w-full z-10 max-w-md space-y-8 flex gap-4 p-10 bg-primary/20 rounded-lg backdrop-blur-lg">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form className="mt-4 space-y-6" onSubmit={handleSignIn}>
              <div className="">
                <div className='my-3 bg-secondary rounded-lg'>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div  className='my-3 bg-secondary rounded-lg'>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form className="mt-4 space-y-6" onSubmit={handleSignUp}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div  className='my-3 bg-secondary rounded-lg'>
                  <Input
                    id="new-email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='my-3 bg-secondary rounded-lg'>
                  <Input
                    id="new-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
