"use client";

import DotPattern from "@/components/ui/dot-pattern";
import Particles from "@/components/ui/particles";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const SidebarBackgroundPattern = () => {
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === "light";

  return (
    <div className="overflow-hidden">
    <div className="absolute size-full bg-[url('/noise.png')] max-h-screen max-w-screen opacity-0 transition-opacity duration-1000 ease-in-out" 
           style={{ animationName: 'fadeIn', animationDuration: '.1s', animationFillMode: 'forwards', animationTimingFunction: 'ease-in-out' }}>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.10; }
        }
      `}</style>
      <DotPattern
        width={32}
        height={32}
        cx={3}
        cy={1}
        cr={1}
        dotColor="#3c3c3c22"
        className={cn(
          "[mask-image:radial-gradient(ellipse,rgba(0,0,0,0.6)_30%,black_50%)]",
          "dark:fill-slate-700"
        )}
      />
      <Particles
        className="absolute inset-0 opacity-20"
        quantity={60}
        staticity={100}
        size={90}
        ease={8000}
        color={isLightTheme ? "#0099aa" : "#ff66ff"}
        BlurAmount="blur-3xl"
        refresh
      />
    </div>
  );
};
