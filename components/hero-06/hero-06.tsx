import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { BackgroundPattern } from "./background-pattern";
// import Link from "next/link";

const Hero06 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <BackgroundPattern />

      <div className="z-10 text-center max-w-2xl">
        <Badge className="bg-gradient-to-br via-70% from-primary via-sky-300 to-primary rounded-full py-1 border-none">
          Just released v0.0.9
        </Badge>
        <h1 className="mt-6 text-9xl tracking-[0.22em] sm:text-5xl md:text-6xl font-bold !leading-[1.2] ">
          STOA
        </h1>
        <p className="mt-6 text-[17px] md:text-lg">
          Scalable, Tailored, Open and Accessible
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Get Started <ArrowUpRight className="!h-5 !w-5" />
          </Button>
    
          <Button size="lg" className="rounded-full text-base" onClick={() => window.location.href = '/dashboard'} >
            App <ArrowUpRight className="!h-5 !w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="!h-5 !w-5" /> Watch Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero06;
