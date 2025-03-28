"use client";
/* eslint-disable */

import DotPattern from "@/components/ui/dot-pattern";
import Particles from "@/components/ui/particles";
import { cn } from "@/lib/utils";

interface MediumBackgroundPatternProps {
  disableBlob?: boolean;
}

export function MediumBackgroundPattern({ disableBlob = false }: MediumBackgroundPatternProps) {
  const blur = "blur-3xl";
  const ease = 800;
  const opacity = 70;
  const staticity = 50;
  const hexVal = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--blob-color-hex').trim() : '#ffffff';
  if (disableBlob) {
    return (
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute z-3 inset-0 object-cover bg-[url('/noise.png')] opacity-0 transition-opacity duration-1000 ease-in-out"
          style={{
            animationName: "fadeIn",
            animationDuration: ".4s",
            animationFillMode: "forwards",
            animationTimingFunction: "ease-in-out",
          }}
        ></div>
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 0.2;
            }
          }
        `}</style>
      </div>
    );
  } else {
    return (
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute z-3 inset-0 object-cover bg-muted/30 bg-[url('/noise.png')] opacity-0 transition-opacity duration-1000 ease-in-out"
          style={{
            animationName: "fadeIn",
            animationDuration: ".4s",
            animationFillMode: "forwards",
            animationTimingFunction: "ease-in-out",
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
          className={`absolute z-2 inset-0 opacity-${opacity} the-particles`}
          quantity={4}
          staticity={staticity}
          size={190}
          ease={ease}
          color={hexVal}
          BlurAmount={blur}
          refresh
        />
        <Particles
          className={`absolute z-2 inset-0 opacity-${opacity} the-particles`}
          quantity={24}
          staticity={staticity}
          size={190}
          ease={ease}
          color={hexVal}
          BlurAmount={blur}
          refresh
        />
        <Particles
          className={`absolute z-2 inset-0 opacity-${opacity} the-particles`}
          quantity={4}
          staticity={staticity}
          size={190}
          ease={ease}
          color={hexVal}
          BlurAmount={blur}
          refresh
        />
        <Particles
          className={`absolute z-2 inset-0 opacity-${opacity} the-particles`}
          quantity={4}
          staticity={staticity}
          size={190}
          ease={ease}
          color={hexVal}
          BlurAmount={blur}
          refresh
        />
      </div>
    );
  }
}
