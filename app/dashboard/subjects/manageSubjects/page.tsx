"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/toggle-theme";
import { getCurrentUserId } from "@/lib/firebase/auth";

import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/lib/firebase/hooks/useAuth";

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const availableSubjects = ["Math", "Science", "English"];

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [archivedSubjects, setArchivedSubjects] = useState<string[]>([]);

  if (!loading && !user) {
    router.push("/login");
  }

  useEffect(() => {
    async function loadSubjects() {
      const userDoc = await getDocs(
        query(collection(db, "users"), where("id", "==", getCurrentUserId()))
      );
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        setSubjects(userData.subjectIds || []);
        setArchivedSubjects(userData.archivedSubjects || []);
      }
    }
    loadSubjects();
  }, []);

  const toggleSubject = async (subjectName: string) => {
    try {
      const userDoc = await getDocs(
        query(collection(db, "users"), where("id", "==", getCurrentUserId()))
      );
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const updatedSubjects = userData.subjectIds?.includes(subjectName)
          ? userData.subjectIds.filter((sub: string) => sub !== subjectName)
          : [...(userData.subjectIds || []), subjectName];

        await updateDoc(userDoc.docs[0].ref, { subjectIds: updatedSubjects });
        setSubjects(updatedSubjects);
      }
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const archiveSubjects = async () => {
    try {
      if (subjects.length === 0) return;

      const userDoc = await getDocs(
        query(collection(db, "users"), where("id", "==", getCurrentUserId()))
      );

      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const updatedArchivedSubjects = [...(userData.archivedSubjects || []), ...subjects];

        await updateDoc(userDoc.docs[0].ref, {
          subjectIds: [],
          archivedSubjects: updatedArchivedSubjects,
        });

        setSubjects([]);
        setArchivedSubjects(updatedArchivedSubjects);
      }
    } catch (error) {
      console.error("Error archiving subjects:", error);
    }
  };

  const removeArchivedSubject = async (subjectName: string) => {
    try {
      const userDoc = await getDocs(
        query(collection(db, "users"), where("id", "==", getCurrentUserId()))
      );

      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const updatedArchivedSubjects = userData.archivedSubjects.filter(
          (sub: string) => sub !== subjectName
        );

        await updateDoc(userDoc.docs[0].ref, {
          archivedSubjects: updatedArchivedSubjects,
        });

        setArchivedSubjects(updatedArchivedSubjects);
      }
    } catch (error) {
      console.error("Error removing archived subject:", error);
    }
  };

  return (
    <SidebarInset className="bg-secondary/50 h-screen overflow-scroll scroll-auto">
      <header className="flex h-16 items-center gap-4 px-4 border-b">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Manage Subjects</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </header>
      <div className="p-6 space-y-6">
        <h2 className="text-4xl font-bold text-gray-800">Manage Subjects</h2>
        <p className="text-gray-600">Select or remove subjects below.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableSubjects.map((subject) => (
            <div
              key={subject}
              className={`p-4 rounded-xl text-center cursor-pointer transition-colors shadow-md ${
                subjects.includes(subject) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => toggleSubject(subject)}
            >
              {subject}
            </div>
          ))}
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mt-6">Selected Subjects:</h3>
        <div className="flex flex-wrap gap-3">
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <div key={index} className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md">
                {subject}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No subjects selected.</p>
          )}
        </div>
        {subjects.length > 0 && (
          <Button onClick={archiveSubjects} className="mt-4 bg-red-500 text-white">
            Archive My Subjects
          </Button>
        )}
        {archivedSubjects.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold text-gray-800 mt-6">Archived Subjects:</h3>
            <div className="flex flex-wrap gap-3">
              {archivedSubjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-full shadow-md"
                >
                  {subject}
                  <button
                    onClick={() => removeArchivedSubject(subject)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </SidebarInset>
  );
}
