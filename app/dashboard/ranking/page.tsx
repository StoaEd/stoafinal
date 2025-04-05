"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase/firebase";
import {
  collection,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

interface User {
  userId: string;
  email?: string;
  username?: string | null;
  score: number;
  rank?: string;
}

const getRank = (score: number) => {
  if (score >= 600) return "Ace";
  if (score >= 351) return "Crown";
  if (score >= 251) return "Platinum";
  if (score >= 141) return "Diamond";
  if (score >= 71) return "Gold";
  if (score >= 31) return "Silver";
  return "Bronze";
};

const getBadge = (index: number) => {
  if (index === 0) return "🥇"; // Gold for Rank 1
  if (index === 1) return "🥈"; // Silver for Rank 2
  if (index === 2) return "🥉"; // Bronze for Rank 3
  return "";
};

const checkAndResetLeaderboard = async () => {
  try {
    const leaderboardMetaRef = doc(db, "leaderboard_meta", "current");
    const leaderboardMetaSnap = await getDoc(leaderboardMetaRef);

    let lastResetDate: Date | null = null;

    if (leaderboardMetaSnap.exists()) {
      const lastReset = leaderboardMetaSnap.data().lastReset;
      if (lastReset && typeof lastReset.toDate === "function") {
        lastResetDate = lastReset.toDate() as Date;
      }
    }

    const now = new Date();

    // ✅ Ensure leaderboard resets only when the month changes
    if (!lastResetDate || now.getMonth() !== lastResetDate.getMonth()) {
      console.log("🔄 Resetting leaderboard for the new month...");

      // Archive old scores before deletion
      const scoresRef = collection(db, "quiz_scores");
      const scoresSnapshot = await getDocs(scoresRef);

      // ✅ Use Promise.all() to efficiently process Firestore operations
      await Promise.all(
        scoresSnapshot.docs.map(async (scoreDoc) => {
          const scoreData = scoreDoc.data();
          await setDoc(doc(db, "archived_scores", scoreDoc.id), scoreData);
          await deleteDoc(scoreDoc.ref);
        })
      );

      // ✅ Update the reset timestamp
      await setDoc(leaderboardMetaRef, { lastReset: serverTimestamp() });

      console.log("✅ Leaderboard reset completed.");
    }
  } catch (error) {
    console.error("❌ Error resetting leaderboard:", error);
  }
};

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        await checkAndResetLeaderboard(); // Ensure leaderboard resets if needed

        const usersRef = collection(db, "users");
        const scoresRef = collection(db, "quiz_scores");

        const usersSnapshot = await getDocs(usersRef);
        const userData: { [userId: string]: User } = {};

        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = doc.id;
          userData[userId] = {
            userId,
            email: data.email ?? "unknown",
            username: data.username || null,
            score: 0,
          };
        });

        const scoresSnapshot = await getDocs(scoresRef);
        scoresSnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId;

          if (!userId) return;

          if (userData[userId]) {
            userData[userId].score += data.score;
          } else {
            userData[userId] = {
              userId,
              email: data.email ?? "unknown",
              username: null,
              score: data.score,
            };
          }
        });

        const leaderboard: User[] = Object.values(userData).map((user) => ({
          ...user,
          rank: getRank(user.score),
        }));

        leaderboard.sort((a, b) => b.score - a.score);

        setUsers(leaderboard);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-2 w-full h-full mb-2 flex flex-col rounded-lg justify-center items-center bg-gradient-to-b from-primary/0 to-primary/5  text-white">
      <h1 className="text-3xl font-extrabold text-center mb-6">Leaderboard</h1>
      <Card className="shadow-lg p-4 bg-gradient-to-b from-primary/5 to-primary/0 text-primary rounded-lg">
        <CardContent className="px-0 ">
          <ul className="space-y-4">
            {users.map((user, index) => (
              <li
                key={index}
                className="p-4 rounded-lg flex items-center gap-4 bg-secondary border-2 border-primary/10 shadow-md"
              >
                <span className="font-bold text-lg">
                  {getBadge(index)} Rank {index + 1}:
                </span>
                <div className="flex-1">
                  <p className="font-medium">
                    {user.username ?? user.email ?? "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.score} points ({user.rank})
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
