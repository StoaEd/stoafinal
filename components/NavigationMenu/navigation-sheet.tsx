import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="mx-4">
              <div className="my-6">
              <Logo />
            </div>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>
              Navigate to different pages of the website.
            </SheetDescription>
          </div>
        </SheetHeader>
        <NavMenu orientation="vertical" className="mt-12 mx-4 p-4" />
      </SheetContent>
    </Sheet>
  );
};
