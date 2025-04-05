"use client";
import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const vowels = new Set(["A", "E", "I", "O", "U"]);
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const words = ["APPLE", "TABLE", "CHAIR", "PENCIL", "HOUSE", "PLANT", "GREAT", "SCHOOL", "BREAD", "WATER", "SMILE", "MUSIC", "HAPPY", "CLOUD", "BRAVE"];

const getRandomWords = (count: number) => {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const TracingCanvas = ({ character, onSuccess, colorBlindMode }: { character: string; onSuccess: () => void, colorBlindMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = () => setIsDrawing(true);
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.fillStyle = colorBlindMode ? "gray" : "black";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const checkSimilarity = async () => {
    const similarityScore = Math.random() * 100; // Simulating AI-based similarity check
    clearCanvas();

    if (similarityScore >= 45) {
      alert("Wowwwww! Moving next...");
      onSuccess(); // Move to next character/word
    } else {
      alert("Keep trying! You can do it!");
    }
  };

  return (
    <Card className="p-4 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Trace {character}</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="border rounded bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="flex flex-row gap-2 mt-4">
          <Button className="" onClick={clearCanvas}>Clear</Button>
          <Button className={` ${colorBlindMode ? 'bg-gray-500' : 'bg-green-500'}`} onClick={checkSimilarity}>Check</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function LearningApp() {
  const { user } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSpeciallyAbled, setIsSpeciallyAbled] = useState<boolean | null>(null);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);
  const [wordList, setWordList] = useState<string[]>(getRandomWords(15));

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          setIsSpeciallyAbled(docSnap.exists() ? !!docSnap.data().speciallyAbled : false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsSpeciallyAbled(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const speakCharacter = (char: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = "en-US"; // Set language
    utterance.rate = 0.8; // Slightly slower speech
    synth.speak(utterance);
  };

  const characters = isAdvanced ? wordList : [...letters, ...numbers];

  const handleCharacterClick = (index: number) => {
    setSelectedIndex(index);
    speakCharacter(characters[index]); // Announce character/word
  };

  if (isSpeciallyAbled === null) {
    return <p className="text-center text-lg font-bold">Checking access...</p>;
  }

  if (!isSpeciallyAbled) {
    return <p className="text-center text-lg text-white font-bold">Access denied. This page is only available for specially-abled users.</p>;
  }

  const moveToNextCharacter = () => {
    const nextIndex = (selectedIndex + 1) % characters.length;
    setSelectedIndex(nextIndex);
    speakCharacter(characters[nextIndex]); // Announce next character
  };

  return (
    <div className="max-w-2xl mx-auto p-6 h-full overflow-y-auto">
      <h1 className="text-center text-3xl font-bold mb-4">Dyslexic-Friendly Learning</h1>

      <div className="flex justify-center items-center mb-4">
        <span className="mr-2 text-lg font-semibold">Advanced Mode:</span>
        <Switch
          checked={isAdvanced}
          onCheckedChange={() => {
            setIsAdvanced(!isAdvanced);
            setSelectedIndex(0);
            if (!isAdvanced) setWordList(getRandomWords(15)); // Refresh word list
          }}
        />
      </div>

      <div className="flex justify-center items-center mb-4">
        <span className="mr-2 text-lg font-semibold">Color Blindness Mode:</span>
        <Switch
          checked={isColorBlindMode}
          onCheckedChange={() => setIsColorBlindMode(!isColorBlindMode)}
        />
      </div>

      {!isAdvanced ? (
        <div className="grid grid-cols-5 gap-2 mb-4">
          {characters.map((char, index) => (
            <Button 
              key={char} 
              className="text-xl p-4" 
              style={{
                backgroundColor: isColorBlindMode ? "gray" : vowels.has(char) ? "blue" : "yellow", 
                color: isColorBlindMode ? "black" : "black"
              }}
              onClick={() => handleCharacterClick(index)}
            >
              {char}
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center text-2xl font-bold mt-4">
          {characters[selectedIndex].split("").map((letter, i) => (
            <span 
              key={i} 
              style={{ color: isColorBlindMode ? "gray" : vowels.has(letter) ? "blue" : "yellow" }}
            >
              {letter}
            </span>
          ))}
        </div>
      )}

      <TracingCanvas character={characters[selectedIndex]} onSuccess={moveToNextCharacter} colorBlindMode={isColorBlindMode} />
    </div>
  );
}
