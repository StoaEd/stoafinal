"use client";
import Hero06 from "@/components/hero-06/hero-06";
import Contact03Page from "@/components/contact-03/contact-03";
import Team04Page from "@/components/team-04/team-04";
import CustomNavigationMenu from "@/components/NavigationMenu/NavigationMenu";
import { ModeToggle } from "@/components/ui/toggle-theme";
export default function Home() {
  return (
    <div>
      <div className="fixed z-20 right-8 top-24 sm:top-24 2xl:top-10"><ModeToggle/></div>
      <CustomNavigationMenu/>
      <div id="home">
        <Hero06 />
      </div>
      <div id="contact">
        <Contact03Page />
      </div>
      <div id="team">
        <Team04Page />
      </div>
    </div>
  );
}
