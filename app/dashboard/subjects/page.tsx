"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
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
  // or,
  // addDoc,
  // updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [subjects, setSubjects] = useState<string[]>([]);

  if (!loading && !user) {
    router.push("/login");
  }

  useEffect(() => {
    async function loadSubjects() {
      // console.log("page", auth.currentUser?.email);
      const usersCollection = collection(db, "notes");

      const userObjectQuery = query(
        usersCollection,
        where("authorId", "==", getCurrentUserId())
      );

      const userObjectSnapshot = await getDocs(userObjectQuery);

      // console.log(userObjectSnapshot.docs);
      const subjects = userObjectSnapshot.docs.map(
        (doc) => doc.data().subjectIds
      );
      console.log("subjects : ",subjects);
      setSubjects(subjects)
    }
    loadSubjects();
  }, []);



  return (
    <SidebarInset className="bg-secondary/48">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <ModeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[70vh] flex-1 rounded-xl md:min-h-min p-10 flex flex-col gap-4">
          <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Subjects
          </div>
          <div className="text-muted-foreground">
            Below are the subjects you are enrolled in. Click on a subject to
            view its content.
          </div>
          <div className="flex flex-row w-full h-full bg-secondary/20"> 
            {subjects && subjects.map((subject, index) => (
              <div key={index} className="p-4 m-2 bg-primary/10 rounded-lg">
                {subject}
              </div>
            ))}
          </div>

        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl flex justify-center items-center"></div>
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
      </div>
    </SidebarInset>
  );
}
