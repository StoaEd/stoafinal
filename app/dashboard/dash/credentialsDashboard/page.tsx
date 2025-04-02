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
import { Loader2, X } from "lucide-react";

const UserDashboard = () => {
  const user = auth.currentUser;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [speciallyAbled, setSpeciallyAbled] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || "");
          setSpeciallyAbled(data.speciallyAbled || false);
          setSkills(data.skills || []);
          setAchievements(data.achievements || []);
        }
      });
    }
  }, [user]);

  const updateUserProfile = async (field: string, value: string | boolean | string[]) => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { [field]: value }, { merge: true });
      alert(`${field} updated successfully`);
    } catch (error) {
      alert(`Failed to update ${field}`);
      console.error(`Error updating ${field}:`, error);
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

  const addSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      updateUserProfile("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    updateUserProfile("skills", updatedSkills);
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      const updatedAchievements = [...achievements, newAchievement.trim()];
      setAchievements(updatedAchievements);
      updateUserProfile("achievements", updatedAchievements);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);
    updateUserProfile("achievements", updatedAchievements);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">User Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Update Username" />
              <Button onClick={() => updateUserProfile("username", username)} className="mt-2 w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Update Username"}
              </Button>
            </div>

            {/* Email */}
            <div>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Update Email" />
              <Button onClick={handleUpdateEmail} className="mt-2 w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Update Email"}
              </Button>
            </div>

            {/* Password */}
            <div>
              <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter Old Password" />
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter New Password" className="mt-2" />
              <Button onClick={handleChangePassword} className="mt-2 w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
              </Button>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="flex space-x-2 mt-2">
                <Input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add Skill" />
                <Button onClick={addSkill}>Add</Button>
              </div>
              <div className="mt-2 space-y-1">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-black rounded">
                    <span>{skill}</span>
                    <X className="cursor-pointer" onClick={() => removeSkill(index)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold">Achievements</h3>
              <div className="flex space-x-2 mt-2">
                <Input type="text" value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} placeholder="Add Achievement" />
                <Button onClick={addAchievement}>Add</Button>
              </div>
              <div className="mt-2 space-y-1">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-200 rounded">
                    <span>{achievement}</span>
                    <X className="cursor-pointer" onClick={() => removeAchievement(index)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Specially Abled */}
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={speciallyAbled} onChange={(e) => setSpeciallyAbled(e.target.checked)} />
                <span>Are you specially abled?</span>
              </label>
              <Button onClick={() => updateUserProfile("speciallyAbled", speciallyAbled)} className="mt-2 w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Save Preference"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
