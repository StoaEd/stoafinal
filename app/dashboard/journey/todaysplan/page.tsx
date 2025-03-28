"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getCurrentUserId } from "@/lib/firebase/auth";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  dueDate: string;
  description: string;
  status: "Pending" | "Completed";
}

export default function TodaysPlan() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0]; // Ensure proper date filtering
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      where("dueDate", "==", today)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todaysTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(todaysTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft size={18} />
        Back to Planner
      </Button>
      <h1 className="text-xl font-bold">📌 Today&apos;s Plan</h1>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks scheduled for today.&apos;</p>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="p-3">
            <CardContent>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-500">{task.category} • {task.priority} Priority</p>
              <p className="text-xs mt-1">{task.description}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
