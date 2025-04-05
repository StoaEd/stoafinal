"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, CheckCircle, Briefcase } from "lucide-react";
import { BasicBackgroundPattern } from "@/components/ui/background-patterns/basic-background";

const UserPortfolio = () => {
  const user = auth.currentUser;
  interface UserData {
    username?: string;
    skills?: string[];
    achievements?: string[];
    projects?: { name: string; link: string }[];
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        })
        .catch((error) => console.error("Error fetching user data:", error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  if (!userData) {
    return <p className="text-center text-lg">No portfolio data available.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg relative rounded-xl bg-secondary/1 border-2 border-primary/10">
        <div className="absolute inset-0 z-0">
          <BasicBackgroundPattern />
        </div>

        <CardHeader className="text-center">
          <User className="h-14 w-14 mx-auto text-primary" />
          <CardTitle className="text-2xl font-semibold mt-2">
            {userData.username || "Unnamed User"}
          </CardTitle>
          <p className="text-primary">{user?.email || "No email available"}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skills Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            {userData.skills && userData.skills.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </ul>
            ) : (
              <p className="text-primary">No skills added yet.</p>
            )}
          </div>

          {/* Achievements Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Achievements</h3>
            {userData.achievements && userData.achievements.length > 0 ? (
              <ul className="list-disc pl-5">
                {userData.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="text-primary/70 flex items-center gap-2"
                  >
                    <CheckCircle className="text-green-500 h-5 w-5" />
                    {achievement}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-primary/70">No achievements recorded.</p>
            )}
          </div>

          {/* Projects Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Projects</h3>
            {userData.projects && userData.projects.length > 0 ? (
              <ul className="list-disc pl-5">
                {userData.projects.map((project, index) => (
                  <li
                    key={index}
                    className="text-primary flex items-center gap-2"
                  >
                    <Briefcase className="text-indigo-500 h-5 w-5" />
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {project.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-primary/70">No projects added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPortfolio;
