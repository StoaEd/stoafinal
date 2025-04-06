"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Import auth to get the logged-in user
// import { useRouter } from "next/navigation";

const QuizPage: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // const auth = getAuth(); // ✅ Get the authentication instance
  // const router = useRouter();

  const generateQuiz = async () => {
    setLoading(true);
    setScore(null);
    setQuestions([]);
    setUserAnswers([]);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDm11gT3YNPpByqfetqYSdGGykgbVMZCPc",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Generate ${numQuestions} quiz questions on ${subject} in JSON format.` }] }],
          }),
        }
      );

      const data = await response.json();
      if (!data.candidates) throw new Error("API error: No questions generated.");

      const textResponse = data.candidates[0]?.content?.parts[0]?.text || "[]";
      const quizData = JSON.parse(textResponse.match(/\[([\s\S]*)\]/)?.[0] || "[]");

      setQuestions(quizData);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz.");
    }

    setLoading(false);
  };

  const submitQuiz = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      alert("You must be logged in to submit a quiz.");
      return;
    }
  
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer.trim().toLowerCase() === questions[index].answer.toLowerCase()) {
        correct++;
      }
    });
  
    const finalScore = correct;
    setScore(finalScore);
  
    try {
      const docRef = await addDoc(collection(db, "quiz_scores"), {
        userId: user.uid, // ✅ Store userId instead of email
        email: user.email, // Optional
        score: finalScore,
        totalQuestions: questions.length,
        timestamp: serverTimestamp(),
      });
  
      console.log("Score saved successfully with ID:", docRef.id);
      alert("Score saved successfully!");
    } catch (error) {
      console.error("Error saving score:", error);
      alert("Failed to save score.");
    }
  };
    return (
    <div className="p-6 max-w-2xl  m-auto max-h-screen overflow-y-auto ">
      <h1 className="text-2xl font-bold mb-4">AI-Powered Quiz Generator</h1>
      <Input placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="mb-2" />
      <Input type="number" placeholder="Number of questions" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="mb-4" />
      <Button onClick={generateQuiz} disabled={loading}>{loading ? <Loader className="animate-spin" /> : "Generate Quiz"}</Button>

      {questions.length > 0 && (
        <div className="mt-6">
          {questions.map((q, index) => (
            <Card key={index} className="mb-4 bg-secondary/30">
              <CardContent>
                <p className="font-semibold">{q.question}</p>
                <Textarea
                  placeholder="Your answer"
                  onChange={(e) => {
                    const newAnswers = [...userAnswers];
                    newAnswers[index] = e.target.value;
                    setUserAnswers(newAnswers);
                  }}
                />
              </CardContent>
            </Card>
          ))}
          <Button onClick={submitQuiz} className="mt-4">Submit Quiz</Button>
          {score !== null && <p className="mt-4 font-bold">Your Score: {score} / {questions.length}</p>}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
