"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "@radix-ui/react-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/firebase";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Import authentication

const getRank = (score: number) => {
  if (score >= 600) return "Ace";
  if (score >= 351) return "Crown";
  if (score >= 251) return "Platinum";
  if (score >= 141) return "Diamond";
  if (score >= 71) return "Gold";
  if (score >= 31) return "Silver";
  return "Bronze";
};

const getMonthName = (monthIndex: number) => {
  return new Date(2025, monthIndex).toLocaleString("default", { month: "long" });
};

const GradingSystem: React.FC = () => {
  const router = useRouter();
  const [totalScore, setTotalScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [badge, setBadge] = useState<string | null>(null);
  const [topMonth, setTopMonth] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to view your ranking.");
      setLoading(false);
      return;
    }

    const scoresRef = collection(db, "quiz_scores");
    const userQuery = query(scoresRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(userQuery, (snapshot) => {
      let accumulatedScore = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        accumulatedScore += data.score;
      });

      setTotalScore(accumulatedScore);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch leaderboard to check if the user is in the top 3
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const scoresRef = collection(db, "quiz_scores");
        const scoresSnapshot = await getDocs(scoresRef);
        const users: { userId: string; score: number }[] = [];

        scoresSnapshot.forEach((doc) => {
          const data = doc.data();
          users.push({ userId: data.userId, score: data.score || 0 });
        });

        users.sort((a, b) => b.score - a.score);

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const userIndex = users.findIndex((u) => u.userId === user.uid);

        if (userIndex === 0) {
          setBadge("🥇"); // Gold Medal for Rank 1
          setTopMonth(getMonthName(new Date().getMonth())); // Assign current month
        } else if (userIndex === 1) {
          setBadge("🥈"); // Silver Medal for Rank 2
        } else if (userIndex === 2) {
          setBadge("🥉"); // Bronze Medal for Rank 3
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [totalScore]);

  if (loading) return <p className="text-center">Loading...</p>;

  const rank = getRank(totalScore);

  return (
    <div className="p-6 max-w-lg mx-auto ">
      <h1 className="text-2xl font-bold text-center mb-4">Grading System</h1>
      <Card className="shadow-lg pb-4 p-4 bg-secondary ">
        <CardContent>
          <p className="text-lg font-semibold text-center">Your Score: {totalScore}</p>
          <div className="w-full mt-4 relative h-6 bg-gray-200 rounded-lg overflow-hidden">
            <Progress
              style={{ width: `${Math.min(totalScore / 6, 100)}%` }} // Adjusted scaling
              className="h-full bg-green-500 transition-all duration-500"
            />
          </div>
          <p className="text-center mt-4 text-xl font-bold">Rank: {rank}</p>

          {badge && (
            <p className="text-center mt-2 text-lg font-semibold">
              Your Badge: {badge} {topMonth && `(Conqueror - ${topMonth})`}
            </p>
          )}

          <div className="text-center mt-4">
            <Button onClick={() => router.push("/dashboard/quiz")} className="mt-2">
              Earn More Points
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradingSystem;
