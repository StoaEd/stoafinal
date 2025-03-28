"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import HeaderWithBreadcrumbs from "@/components/ui/ui-templates/header-with-breadcrumbs";
import { getCurrentUserId } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function NotesPage() {
  const [archivedSubjects, setArchivedSubjects] = useState<string[]>([]);

  useEffect(() => {
    async function fetchArchivedSubjects() {
      try {
        const userDoc = await getDocs(
          query(collection(db, "users"), where("id", "==", getCurrentUserId()))
        );

        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setArchivedSubjects(userData.archivedSubjects || []);
        }
      } catch (error) {
        console.error("Error fetching archived subjects:", error);
      }
    }

    fetchArchivedSubjects();
  }, []);

  return (
    <SidebarInset>
      <HeaderWithBreadcrumbs />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Archived Subjects</h2>
        {archivedSubjects.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {archivedSubjects.map((subject, index) => (
              <li
                key={index}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md"
              >
                {subject}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No archived subjects available.</p>
        )}
      </div>
    </SidebarInset>
  );
}
