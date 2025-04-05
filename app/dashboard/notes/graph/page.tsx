import { MediumBackgroundPattern } from "@/components/ui/background-patterns/medium-background";
import { SidebarInset } from "@/components/ui/sidebar";
// import HeaderWithBreadcrumbs from "@/components/ui/ui-templates/header-with-breadcrumbs";

export default function NotesPage() {
  return (
    <SidebarInset className="">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <div className="relative  min-h-[70vh] flex-1 border-2 rounded-xl md:min-h-min p-10 flex flex-col gap-4">
          <div className="absolute inset-0  rounded-lg opacity-20"> {/* add this for taste bg-radial-[at_25%_25%]  from-[#0099dd99] from-10% to-[#ffaaff99] to-90% */}
          <MediumBackgroundPattern disableBlob={true} />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
