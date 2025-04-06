"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

import { useCompletion } from '@ai-sdk/react';

const QuizPage: React.FC = () => {
  // Subject dictionary with associated db table fields
  const subjects = {
    "Python": "python_embeddings",
  };
  
  const [subject, setSubject] = useState(Object.keys(subjects)[0]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState("basic");
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isGrading, setIsGrading] = useState(false);

  const { completion, isLoading, complete } = useCompletion({
    api: '/api/quiz',
    onFinish: () => {
      setLoading(false);
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (completion && completion.trim() !== "") {
      try {
        if (isGrading) {
          // Parse the grading response
          const jsonMatch = completion.match(/{[\s\S]*}/);
          if (jsonMatch) {
            const gradingResult = JSON.parse(jsonMatch[0]);
            setFeedback(gradingResult.feedback);
            setScore(gradingResult.score);
            
            // Save the score to Firebase
            if (getAuth().currentUser) {
              saveScoreToFirebase(gradingResult.score);
            }
          } else {
            console.error("No valid JSON found in grading response");
          }
          setIsGrading(false);
        } else {
          // This is for quiz generation (existing code)
          const jsonMatch = completion.match(/\[([\s\S]*)\]/);
          if (jsonMatch) {
            const quizData = JSON.parse(jsonMatch[0]);
            setQuestions(quizData);
          } else {
            console.error("No valid JSON found in completion response");
          }
        }
      } catch (error) {
        console.error("Error parsing data:", error);
        setIsGrading(false);
      }
    }
  }, [completion]);

  const generateQuiz = async () => {
    setLoading(true);
    setScore(null);
    setQuestions([]);
    setUserAnswers([]);

    try {
      const prompt = `Generate ${numQuestions} ${questionType} quiz questions on ${subject} in JSON format. Each question should have 'question' and 'answer' fields. Return only valid JSON array.`;
      await complete(prompt);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz.");
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      alert("You must be logged in to submit a quiz.");
      return;
    }

    setIsGrading(true);
    
    try {
      // Prepare the grading prompt with all questions and answers
      const gradingData = questions.map((q, idx) => ({
        question: q.question,
        correctAnswer: q.answer,
        userAnswer: userAnswers[idx] || ""
      }));
      
      const gradingPrompt = `
        Grade the following quiz answers and provide specific feedback for each.
        For each question, determine if the answer is correct, partially correct, or incorrect.
        Provide brief, constructive feedback explaining why.
        Calculate a final score out of ${questions.length}.
        
        Questions and answers: ${JSON.stringify(gradingData)}
        
        Return a JSON object with this structure:
        {
          "feedback": [array of feedback strings for each question],
          "score": number
        }
      `;
      
      await complete(gradingPrompt);
    } catch (error) {
      console.error("Error grading quiz:", error);
      alert("Failed to grade quiz.");
      setIsGrading(false);
    }
  };

  // Function to save score to Firebase
  const saveScoreToFirebase = async (finalScore: number) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) return;
      
      const docRef = await addDoc(collection(db, "quiz_scores"), {
        userId: user.uid,
        email: user.email,
        score: finalScore,
        totalQuestions: questions.length,
        subject: subject,
        dbTable: subjects[subject as keyof typeof subjects],
        timestamp: serverTimestamp(),
      });
  
      console.log("Score saved successfully with ID:", docRef.id);
    } catch (error) {
      console.error("Error saving score:", error);
      alert("Failed to save score.");
    }
  };

  return (
    <div className="p-6 max-w-2xl  m-auto max-h-screen overflow-y-auto ">
      <h1 className="text-2xl font-bold mb-4">AI-Powered Quiz Generator</h1>
      <DropdownMenu/>
      <div className="mb-4">
        <Select
          value={subject}
          onValueChange={(value) => setSubject(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(subjects).map((subj) => (
              <SelectItem key={subj} value={subj}>
                {subj}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Input placeholder="Type of questions you'd like" value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="mb-2" />
      <Input type="number" placeholder="Number of questions" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="mb-4" />
      <Button onClick={generateQuiz} disabled={loading || isLoading}>
        {loading || isLoading ? <Loader className="animate-spin" /> : "Generate Quiz"}
      </Button>

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
                {feedback[index] && (
                  <div className="mt-2 p-2 bg-primary/10 rounded text-sm">
                    <p><strong>Feedback:</strong> {feedback[index]}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <Button 
            onClick={submitQuiz} 
            className="mt-4" 
            disabled={isGrading || loading}
          >
            {isGrading ? <Loader className="animate-spin mr-2" /> : null}
            {isGrading ? "Grading..." : "Submit Quiz"}
          </Button>
          {score !== null && <p className="mt-4 font-bold">Your Score: {score} / {questions.length}</p>}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
