/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Mic, MicOff } from "lucide-react";

// const MODEL = "models/ggemini-2.0-flash";
// const API_KEY = "AIzaSyA6nurUo8o4U5fluQA-TyAUW5al37znqzM";
// const HOST = "generativelanguage.googleapis.com";

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    let recognition: any = null;
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
    }

    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

    const startListening = () => {
        if (!recognition) return;
        setListening(true);
        recognition.start();
        
        recognition.onresult = (event: any) => {
            setInput(event.results[0][0].transcript);
        };
    
        recognition.onend = () => setListening(false);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
    
        const newMessage = { text: input, sender: "user" as const };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setLoading(true);
    
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDm11gT3YNPpByqfetqYSdGGykgbVMZCPc`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: input }] }] }),
            });
    
            if (!response.ok) throw new Error("Failed to fetch response");
    
            const data = await response.json();
            const botMessage = {
                text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.",
                sender: "bot" as const,
            };
    
            setMessages((prev) => [...prev, botMessage]);
            speak(botMessage.text);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessages((prev) => [...prev, { text: "Error fetching response", sender: "bot" as const }]);
        }
        setLoading(false);
    };

    const speak = (text: string) => {
        if (!synth) return;
        text=text.replace(/<[^>]*>/g, '');
        text=text.replace('*',"")
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        synth.speak(utterance);
    };

    return (
        <div className="max-w-2xl min-w-xl mx-auto p-6 border rounded-2xl shadow-lg bg-secondary  ">
            <Card className="bg-secondary min-h-96 max-h-96">
                <CardContent className="h-full overflow-y-auto p-4 space-y-3  rounded-lg">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-xl max-w-xs ${msg.sender === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-700 text-white mr-auto"}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </CardContent>
            </Card>
            <div className="flex mt-4 items-center gap-2">
                <Button onClick={startListening} className="p-3 rounded-full bg-gray-600 text-white hover:bg-gray-700">
                    {listening ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-xl shadow-sm bg-gray-800 text-white focus:ring focus:ring-blue-300"
                />
                <Button onClick={sendMessage} disabled={loading} className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                    {loading ? "..." : <Send size={20} />}
                </Button>
            </div>
        </div>
    );
};

export default Chatbot;