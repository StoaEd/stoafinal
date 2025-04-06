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

const getProgressPercentage = (score: number) => {
  if (score >= 600) return 100;
  if (score >= 351) return 85;
  if (score >= 251) return 70;
  if (score >= 141) return 55;
  if (score >= 71) return 40;
  if (score >= 31) return 25;
  return (score / 31) * 25; // For Bronze rank
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
    <div className="p-6 max-w-lg mx-auto bg-transparent min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-primary">Grading System</h1>
      <Card className="shadow-lg pb-6 p-6 bg-secondary rounded-lg border border-primary/10">
        <CardContent>
          <p className="text-lg font-semibold text-center text-primary">Your Score: {totalScore}</p>
          <div className="w-full mt-6 relative h-6 bg-gray-300 rounded-full overflow-hidden">
            <Progress
              style={{ width: `${getProgressPercentage(totalScore)}%` }}
              className="h-full bg-gradient-to-r from-blue-300 to-blue-500 transition-all duration-500"
            />
          </div>
          <p className="text-center mt-6 text-2xl font-bold text-primary">Rank: {rank}</p>

          {badge && (
            <p className="text-center mt-4 text-lg font-semibold text-primary">
              Your Badge: <span className="text-yellow-500">{badge}</span>{" "}
              {topMonth && <span className="text-gray-500">(Conqueror - {topMonth})</span>}
            </p>
          )}

          <div className="text-center mt-6">
            <Button
              onClick={() => router.push("/dashboard/quiz")}
              className="mt-2  hover:bg-primary text-secondary font-medium px-4 py-2 rounded-lg"
            >
              Earn More Points
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradingSystem;
