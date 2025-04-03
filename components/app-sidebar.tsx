/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import {
  AudioWaveform,
  BookOpen,
  BookMarked,
  // Bot,
  Telescope,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { SubjectSwitcher } from "@/components/team-switcher";

import { useAuth } from "@/lib/firebase/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
let data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/vercel.svg",
  },
  subjects: [
    {
      name: "Personal",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "School",
      logo: AudioWaveform,
      plan: "School",
    },
    {
      name: "Academic",
      logo: Command,
      plan: "Academic",
    },
  ],
  navMain: [
    {
      title: "DashBoard",
      url: "/dashboard/OverviewDashboard",
      icon: LayoutDashboard,
      isActive: false,
      items: [
        {
          title: "Outline",
          url: "/dashboard/dash/overviewDashboard",
        },
        {
          title: "Credentials",
          url: "/dashboard/dash/credentialsDashboard",
        },
      ],
    },

    {
      title: "Synergy Hub",
      url: "/dashboard/OverviewDashboard",
      icon: LayoutDashboard,
      isActive: false,
      items: [
        {
          title: "Global Hub",
          url: "/dashboard/synergyhub",
        },
        {
          title: "AI chat",
          url: "/dashboard/synergyhub/aichat",
        },
        {
          title: "MultiModel AI",
          url: "/dashboard/synergyhub/multi/mutlim",
        },
        {
          title: "Comfort Hub",
          url: "/dashboard/synergyhub/comforthub",
        },



      ],
    },
    {
      title: "Milestones",
      url: "#",
      icon: Telescope,
      items: [
        {
          title: "Agenda",
          url: "/dashboard/journey/todaysplan",
        },
        {
          title: "Organiser ",
          url: "/dashboard/journey/planner",
        },
      ],
    },
    {
      title: "Domains",
      url: "#",
      icon: BookMarked,
      items: [
        {
          title: "My Courses",
          url: "/dashboard/subjects/mysubjects",
        },
        {
          title: "Manage Subjects",
          url: "/dashboard/subjects/manageSubjects",
        },
        {
          title: "Archived subjects",
          url: "/dashboard/subjects/archivedSubjects",
        },
        {
          title: "Learn From Scratch With Help",
          url: "/dashboard/subjects/lfsh",
        },
        {
          title: "Learn Sign Language",
          url: "/dashboard/subjects/signlanguage",
        },


      ],
    },
    {
      title: "Notes",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Shelf",
          url: "/dashboard/notes/shelf",
        },
        {
          title: "Graph",
          url: "/dashboard/notes/graph",
        },
        {
          title: "Voice to Text",
          url: "/dashboard/notes/voice",
        },
      ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Quiz",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Challenge Yourself",
          url: "/dashboard/quiz",
        },
      ],
    },
    {
      title: "Performance Tracker",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Score",
          url: "/dashboard/grading",
        },
        {
          title: "Leaderboard",
          url: "/dashboard/ranking",
        },

      ],
    },
  ],
  projects: [
    {
      name: "Project Hub",
      url: "/dashboard/projects",
      icon: Frame,
    },
  ],
};

type UserState = {
  name: string | null;
  email: string | null;
  avatar: string | null;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState<string | null>(null);

  // Fetch username from Firestore
  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUsername(docSnap.data().username || user.email);
          } else {
            setUsername(user.email); // Default to email if username doesn't exist
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };
    fetchUsername();
  }, [user]);

  // Update user data when username is available
  if (user?.email) {
    data.user = {
      name: username || "User", // Ensure it's always defined
      email: user.email,
      avatar: "/avatars/vercel.svg",
    };
  }



  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="text-slate-600 dark:text-stone-200 [text-shadow-class] relative px-2  border-none bg-[#fafafa] dark:bg-[#171717] "
    >
      <SidebarHeader className="bg-secondary/40 rounded-md border-2 mt-2 ">
        <SubjectSwitcher subjects={data.subjects} />
      </SidebarHeader>
      <SidebarContent className=" rounded-md my-2">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="bg-secondary/40 rounded-md border-2 my-2 mt-0">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail className="" />
    </Sidebar>
  );
}
