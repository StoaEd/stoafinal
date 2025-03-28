"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Trash, Edit, CheckCircle, Calendar } from "lucide-react";
import { getCurrentUserId } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot, query, where } from "firebase/firestore";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  dueDate: string;
  description: string;
  status: "Pending" | "Completed";
  userId: string;
}

const categories = ["Assignment", "Exam", "Lecture", "Meeting", "Other"];
const priorities = ["Low", "Medium", "High"];

export default function Planner() {
  const router = useRouter();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Assignment");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const userId = getCurrentUserId();
    const q = query(collection(db, "tasks"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async () => {
    if (!title.trim() || !dueDate.trim() || !description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const userId = getCurrentUserId();
      if (editingId !== null) {
        await updateDoc(doc(db, "tasks", editingId), { title, category, priority, dueDate, description });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "tasks"), {
          title,
          category,
          priority,
          dueDate,
          description,
          status: "Pending",
          userId,
        });
      }
      setTitle("");
      setDueDate("");
      setDescription("");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setCategory(task.category);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setDescription(task.description);
    setEditingId(task.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: "Pending" | "Completed") => {
    try {
      await updateDoc(doc(db, "tasks", id), { status: currentStatus === "Pending" ? "Completed" : "Pending" });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">📅 Academic Planner</h1>
      <Button variant="outline" className="w-full mb-4 flex items-center gap-2" onClick={() => router.push("/dashboard/journey/todaysplan")}> 
      <Calendar size={18} /> View Today&apos;s Plan
      </Button>
      <div className="space-y-2">
        <Input placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">Category: {category}</SelectTrigger>
          <SelectContent>{categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full">Priority: {priority}</SelectTrigger>
          <SelectContent>{priorities.map((prio) => (<SelectItem key={prio} value={prio}>{prio}</SelectItem>))}</SelectContent>
        </Select>
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <Textarea placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button onClick={handleAddTask}>{editingId !== null ? "Update Task" : "Add Task"}</Button>
      </div>
      {loading ? <p>Loading tasks...</p> : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card key={task.id} className="p-3 flex justify-between items-center">
              <CardContent className="flex-1">
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-500">{task.category} • {task.priority} Priority • Due {task.dueDate}</p>
                <p className="text-xs text-gray-600 mt-1">{task.description}</p>
              </CardContent>
              <div className="flex space-x-2">
                <Button size="icon" onClick={() => toggleStatus(task.id, task.status)} variant={task.status === "Completed" ? "default" : "secondary"}>
                  <CheckCircle size={16} className={task.status === "Completed" ? "text-green-500" : "text-gray-400"} />
                </Button>
                <Button size="icon" onClick={() => handleEdit(task)}><Edit size={16} /></Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(task.id)}><Trash size={16} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
