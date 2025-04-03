"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/hooks/useAuth";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const VideoPlayer: React.FC = () => {
  const { user } = useAuth();
  const [isSpeciallyAbled, setIsSpeciallyAbled] = useState<boolean | null>(null);
  const [inputText, setInputText] = useState("");
  const [videoQueue, setVideoQueue] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(null);
  const [currentWord, setCurrentWord] = useState("");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handlePlayVideo = async () => {
    if (!inputText.trim()) return;

    const words = inputText.split(" ").filter((word) => word.length > 0);
    const videos: string[] = [];

    for (const word of words) {
      const capitalizedWord =
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      const fullVideoPath = `/videos/${capitalizedWord}.mp4`;

      if (await checkVideoAvailability(fullVideoPath)) {
        videos.push(fullVideoPath);
      } else {
        for (let i = 0; i < word.length; i++) {
          const char = word[i].toUpperCase();
          const letterVideoPath = `/videos/${char}.mp4`;
          if (await checkVideoAvailability(letterVideoPath)) {
            videos.push(letterVideoPath);
          }
        }
      }
    }

    setVideoQueue(videos);
    setCurrentVideoIndex(0);
  };

  const checkVideoAvailability = async (videoPath: string): Promise<boolean> => {
    try {
      const response = await fetch(videoPath, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (videoQueue.length > 0 && currentVideoIndex !== null) {
      const currentSrc = videoQueue[currentVideoIndex];
      setCurrentWord(
        currentSrc.split("/").pop()?.replace(".mp4", "") || ""
      );
    }
  }, [currentVideoIndex, videoQueue]);

  const handleVideoEnd = () => {
    if (currentVideoIndex !== null && currentVideoIndex < videoQueue.length - 1) {
      setCurrentVideoIndex((prevIndex) => (prevIndex !== null ? prevIndex + 1 : 0));
    }
  };

  if (isSpeciallyAbled === null) {
    return <p className="text-center text-lg font-bold text-white">Checking access...</p>;
  }

  if (!isSpeciallyAbled) {
    return <p className="text-center text-lg text-white font-bold">Access denied. This page is only available for specially-abled users.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-300">Teaching Sign Language</h1>

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter text..."
          value={inputText}
          onChange={handleInputChange}
          className="w-full p-3 text-lg border border-gray-700 rounded-lg bg-black text-white focus:outline-none"
        />
        <button
          onClick={handlePlayVideo}
          className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white text-lg py-3 rounded-lg transition"
        >
          ▶ Convert
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mt-8">
        {videoQueue.length > 0 && currentVideoIndex !== null && currentVideoIndex < videoQueue.length && (
          <>
            <video
              key={videoQueue[currentVideoIndex] + "-" + currentVideoIndex}
              src={videoQueue[currentVideoIndex]}
              onEnded={handleVideoEnd}
              autoPlay
              className="w-[900px] h-[500px] rounded-xl shadow-2xl border-4 border-gray-600"
            />
            <p className="mt-4 text-3xl font-bold bg-gray-700 px-6 py-2 rounded-lg shadow-lg text-white">
              {currentWord}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
