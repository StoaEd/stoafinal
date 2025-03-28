"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/firebase";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const UserSettings = () => {
  const user = auth.currentUser;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [speciallyAbled, setSpeciallyAbled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          setUsername(docSnap.data().username || "");
          setSpeciallyAbled(docSnap.data().speciallyAbled || false);
        }
      });
    }
  }, [user]);

  const handleUpdateUsername = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { username }, { merge: true });
      alert("Username updated successfully");
    } catch (error) {
      alert("Failed to update username");
      console.error("Error updating email:", error);
    }
    setLoading(false);
  };

  const handleUpdateEmail = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateEmail(user, email);
      alert("Email updated successfully");
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred");
      console.error("Error updating email:", error);
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email!, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("Password updated successfully");
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred");
      console.error("Error updating password:", error);
    }
    setLoading(false);
  };

  const handleUpdateSpeciallyAbled = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { speciallyAbled }, { merge: true });
      alert("Preference updated successfully");
    } catch (error) {
      alert("Failed to update preference");
      console.error("Error updating preference:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">User Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Update Username" />
              <Button onClick={handleUpdateUsername} className="mt-2 w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Update Username"}
              </Button>
            </div>
            <div>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Update Email" />
              <Button onClick={handleUpdateEmail} className="mt-2 w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Update Email"}
              </Button>
            </div>
            <div>
              <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter Old Password" />
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter New Password" className="mt-2" />
              <Button onClick={handleChangePassword} className="mt-2 w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
              </Button>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={speciallyAbled} onChange={(e) => setSpeciallyAbled(e.target.checked)} />
                <span>Are you specially abled?</span>
              </label>
              <Button onClick={handleUpdateSpeciallyAbled} className="mt-2 w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Save Preference"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;