"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor | undefined;
    webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;
  }
}

const VoiceToText: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [recognition, setRecognition] = useState<null | SpeechRecognition>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const querySnapshot = await getDocs(collection(db, "notes"));
      const notes = querySnapshot.docs.map(doc => doc.data().text);
      setSavedNotes(notes);
    };
    fetchNotes();
  }, [isSaving]);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!SpeechRecognitionAPI) {
      alert("Your browser does not support speech recognition. Try Chrome.");
      return;
    }
  
    const speechRecognition = new SpeechRecognitionAPI();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";
  
    speechRecognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      setText((prev) => prev.trim() + " " + finalTranscript.trim());
    };
  
    setRecognition(speechRecognition);
  
    return () => {
      speechRecognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = async () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      await saveNote();
    }
  };

  const saveNote = async () => {
    if (!text.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, "notes"), { text, timestamp: new Date() });
      alert("Note saved successfully!");
      setText("");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-black text-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Voice to Text Notes</h2>
      <p className="p-2 border rounded bg-gray-800 min-h-[100px]">
        {text || "Start speaking..."}
      </p>
      <div className="mt-4 flex gap-2">
        {!isListening ? (
          <Button onClick={startListening} className="bg-blue-500 text-white">
            Start Converting
          </Button>
        ) : (
          <Button onClick={stopListening} className="bg-red-500 text-white">
            Stop Converting
          </Button>
        )}
        <Button
          onClick={saveNote}
          className="bg-green-500 text-white"
          disabled={isSaving || !text.trim()}
        >
          {isSaving ? "Saving..." : "Save Note"}
        </Button>
      </div>
      <h3 className="text-lg font-bold mt-6">Saved Notes</h3>
      <ul className="mt-2 p-2 bg-gray-900 rounded">
        {savedNotes.length > 0 ? (
          savedNotes.map((note, index) => <li key={index} className="p-1 border-b border-gray-700">{note}</li>)
        ) : (
          <li>No saved notes yet.</li>
        )}
      </ul>
    </div>
  );
};

export default VoiceToText;
