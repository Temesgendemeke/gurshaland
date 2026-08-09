import { AppSidebar } from "@/components/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard/DashboardBreadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b border-border/50 bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <DashboardBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 md:p-6 md:pt-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
