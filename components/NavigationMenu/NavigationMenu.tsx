import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { useRouter } from 'next/navigation';

const glassEffect=' bg-clip-padding backdrop-filter backdrop-blur-sm'

const CustomNavigationMenu = () => {
    const router = useRouter();

  const handleClickSignIn=() => {
    router.push('/login')
  }
  const handleClickGetStarted=() => {
    router.push('/login')
  }

  return (
    <nav className={`${glassEffect} bg-secondary/10 shadow-lg shadow-black/45 fixed z-20 top-6 inset-x-4 h-16 border max-w-screen-xl mx-auto rounded-full `}>
      <div className="absolute inset-0 bg-[url(/noise.png)] opacity-5 rounded-full"></div>
      <div className="h-full flex items-center justify-between mx-auto px-4 relative z-10">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden sm:inline-flex rounded-full p-5"
            onClick={handleClickSignIn}
          >
            Sign In
          </Button>
          <Button className="rounded-full" onClick={handleClickGetStarted}>Get Started</Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavigationMenu;
