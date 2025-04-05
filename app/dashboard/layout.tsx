"use client"
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";

import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import HeaderWithBreadcrumbs from "@/components/ui/ui-templates/header-with-breadcrumbs";



import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/hooks/useAuth';

// export const metadata: Metadata = {
//   title: "STOA Dashboard",
//   description: "Built by 3pi4",
// };

export default function DashBoard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  console.log("page",user?.email)

  // console.log(user)
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <SidebarProvider>
      <AppSidebar className="bg-secondary/50"/>
      <div className="flex justify-center items-center h-screen w-full bg-secondary/48">
        <div className="absolute animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-[var(--blob-color)]"></div>
        <div className="absolute animate-spin rounded-full h-8 w-8 border-r-4 border-l-4 border-primary"></div>
      </div>
    </SidebarProvider>
    )
  }

  if (!user) {
    return null;
  }


  return (
    <SidebarProvider className="h-screen">
      <AppSidebar className="bg-secondary/50"/>
      <SidebarInset className="bg-secondary/47 h-full">
      <HeaderWithBreadcrumbs />
      {children}
      </SidebarInset>

    </SidebarProvider>
  );
}
