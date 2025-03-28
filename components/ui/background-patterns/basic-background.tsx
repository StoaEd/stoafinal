"use client";

// import DotPattern from "@/components/ui/dot-pattern";
import Particles from "@/components/ui/particles";
// import { cn } from "@/lib/utils";

export const BasicBackgroundPattern = () => {
  const hexVal = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--blob-color-hex').trim() : '#ffffff';

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute z-3 inset-0 object-cover bg-[url('/noise.png')] opacity-0 transition-opacity duration-1000 ease-in-out"
        style={{
          animationName: 'fadeIn',
          animationDuration: '.4s',
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-in-out',
        }}
      ></div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.05;
          }
        }
      `}</style>

      <Particles
        className="absolute z-2 inset-0 opacity-80 the-particles"
        quantity={10}
        staticity={100}
        size={60}
        ease={8000}
        color={hexVal}
        BlurAmount="blur-md"
        refresh
      />
    </div>
  );
};