import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/ui/toggle-theme"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import React from "react"
 
export default function HeaderWithBreadcrumbs() {
    const pathname = usePathname()
    
    const breadcrumbs = useMemo(() => {
        // Skip empty paths and the first slash
        const segments = pathname?.split('/').filter(segment => segment !== '') || []
        
        // Format segments for display (transform slugs, capitalize, etc.)
        return segments.map(segment => ({
            label: segment.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            href: `/${segments.slice(0, segments.indexOf(segment) + 1).join('/')}`
        }))
    }, [pathname])
    
    return (
        <header className="flex z-10 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem key={breadcrumb.href}>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <ModeToggle />
        </div>
      </header>
    )
}