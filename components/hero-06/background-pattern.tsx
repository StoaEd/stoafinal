"use client";

import DotPattern from "@/components/ui/dot-pattern";
import Particles from "@/components/ui/particles";
import { cn } from "@/lib/utils";


export const BackgroundPattern = () => {
  const hexVal = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--blob-color-hex').trim() : '#ffffff';

  return (
    <>
      <div className="absolute z-3 inset-0 object-cover bg-[url('/noise.png')] opacity-10 duration-1000 ease-in-out"></div>
      
      <DotPattern
        width={32}
        height={32}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(ellipse,rgba(0,0,0,0.3)_30%,black_50%)]",
          "dark:fill-slate-700"
        )}
      />
      <Particles
        className="absolute inset-0"
        quantity={60}
        ease={80}
        color={hexVal}
        BlurAmount="blur-md"
        refresh
      />
      <Particles
        className="absolute inset-0"
        quantity={60}
        size={10}
        ease={80}
        color={hexVal}
        BlurAmount="blur-md"
        refresh
      />
      <Particles
        className="absolute inset-0"
        quantity={10}
        size={40}
        ease={100}
        // alpha={0.05}
        color={hexVal}
        BlurAmount="blur-none"
        refresh
      />
      <Particles
        className="absolute inset-0"
        quantity={10}
        size={200}
        ease={80}
        color={hexVal}
        BlurAmount="blur-3xl"
        refresh
      />
      <Particles
        className="absolute inset-0"
        quantity={300}
        size={1}
        ease={80}
        color={hexVal}
        BlurAmount="blur-none"
        refresh
      />
    </>
  );
};
