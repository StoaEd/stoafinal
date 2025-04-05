"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { getCurrentUserId } from "@/lib/firebase/auth";

const topicsBySubjectAndGrade: Record<string, Record<number, { topic: string; videoId: string; bookUrl: string }[]>> = {
  Math: {
    1: [
      { topic: "Finding the Furry Cat!", videoId: "td8Wcxz5UXI", bookUrl: "" },
      { topic: "What is Long? What is Round?", videoId: "MN_YGekyPMs", bookUrl: "" },
      { topic: "Mango Treat", videoId: "loAof6F2jeo", bookUrl: "" },
      { topic: "Making 10", videoId: "StHph4rYLOE", bookUrl: "" },
      { topic: "How Many?", videoId: "k9IMztXsCAs", bookUrl: "" },
      { topic: "Vegetable Farm", videoId: "Xr_jyN-awgk", bookUrl: "" },
      { topic: "Lina’s Family", videoId: "6BKuvWkrkJA", bookUrl: "" },
      { topic: "Fun with Numbers", videoId: "nMYNDM077dI", bookUrl: "" },
      { topic: "Utsav", videoId: "jKu_RNN5wOc", bookUrl: "" },
      { topic: "How do I Spend my Day?", videoId: "qD1pnquN_DM", bookUrl: "" },
      { topic: "How Many Times?", videoId: "oPINS56lDes", bookUrl: "" },
      { topic: "How Much Can We Spend?", videoId: "IHPAPyoEY3o", bookUrl: "" },
      { topic: "So Many Toys", videoId: "u-lIKRmxgI0", bookUrl: "" }
    ],
  },
  English: {
    1: [
      { topic: "Two Little Hands", videoId: "SQHNrWLE1wI", bookUrl: "" },
      { topic: "Greetings", videoId: "Fw0rdSHzWFY", bookUrl: "" },
      { topic: "Picture Time", videoId: "axA-tXvREyI", bookUrl: "" },
      { topic: "The Cap-seller and the Monkeys", videoId: "sSAsJ5pHQ0k", bookUrl: "" },
      { topic: "A Farm", videoId: "gCi0NYkrneI", bookUrl: "" },
      { topic: "Fun with Pictures", videoId: "rqfSftRKwPA", bookUrl: "" },
      { topic: "The Food we Eat", videoId: "tw3lVws8g", bookUrl: "" },
      { topic: "The Four Seasons", videoId: "RMLUoN1qhfk", bookUrl: "" },
      { topic: "Anandi’s Rainbow", videoId: "oxNs3f6OPDY", bookUrl: "" }
    ],
  },
};

export default function MySubjects() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectGrades, setSubjectGrades] = useState<Record<string, number>>({});
  const [subjectTopics, setSubjectTopics] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const userQuery = query(collection(db, "users"), where("id", "==", getCurrentUserId()));
        const userDoc = await getDocs(userQuery);

        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setSubjects(userData.subjectIds || []);
          setSubjectGrades(userData.subjectGrades || {});
          setSubjectTopics(userData.subjectTopics || {});
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  const handleGradeChange = (subject: string, grade: number) => {
    setSubjectGrades((prev) => ({ ...prev, [subject]: grade }));
    setSubjectTopics((prev) => ({ ...prev, [subject]: "" }));
  };

  const handleTopicChange = (subject: string, topic: string) => {
    setSubjectTopics((prev) => ({ ...prev, [subject]: topic }));
  };

  const handleSave = async () => {
    try {
      const userQuery = query(collection(db, "users"), where("id", "==", getCurrentUserId()));
      const userDoc = await getDocs(userQuery);

      if (!userDoc.empty) {
        const userRef = doc(db, "users", userDoc.docs[0].id);
        await updateDoc(userRef, { subjectGrades, subjectTopics });
        alert("Selections saved successfully!");
      }
    } catch (error) {
      console.error("Error updating selections:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto h-full overflow-scroll scroll w-lg">
      <h2 className="text-2xl font-bold mb-4">Select Your Class & Topics</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : subjects.length > 0 ? (
        <div className="space-y-4">
          {subjects.map((subject) => {
            const selectedGrade = subjectGrades[subject];
            const topics = selectedGrade ? topicsBySubjectAndGrade[subject]?.[selectedGrade] : [];

            return (
              <div key={subject} className="p-3  rounded-lg bg-secondary text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{subject}</span>
                  <select
                    value={selectedGrade || (subject === "Science" ? 6 : 1)}
                    onChange={(e) => handleGradeChange(subject, Number(e.target.value))}
                    className="p-2 border rounded-lg bg-secondary text-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1)
                      .filter((grade) => subject !== "Science" || grade >= 6)
                      .map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                  </select>
                </div>
                {topics?.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Topic:</span>
                    <select
                      value={subjectTopics[subject] || ""}
                      onChange={(e) => handleTopicChange(subject, e.target.value)}
                      className="p-2 border rounded bg-black text-white"
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>
                      {topics.map(({ topic }) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {subjectTopics[subject] && topics?.length > 0 && (
                  (() => {
                    const selectedTopic = topics.find((t) => t.topic === subjectTopics[subject]);
                    if (!selectedTopic) return null;

                    return (
                      <div className="mt-4 space-y-3">
                        <div className="w-full flex justify-start">
                          <iframe
                            className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-lg"
                            src={`https://www.youtube.com/embed/${selectedTopic.videoId}`}
                            title="YouTube video"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <a
                          href={selectedTopic.bookUrl}
                          download
                          className="block bg-blue-600 text-white text-center py-2 rounded"
                        >
                          Download Textbook
                        </a>
                      </div>
                    );
                  })()
                )}
              </div>
            );
          })}
          <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Save Selection
          </button>
        </div>
      ) : (
        <p className="text-gray-500">No subjects selected.</p>
      )}
    </div>
  );
}
