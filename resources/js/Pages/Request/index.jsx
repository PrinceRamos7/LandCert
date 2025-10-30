import { AppSidebar } from "@/Components/app-sidebar";
import { AdminSidebar } from "@/Components/admin-sidebar";
import { usePage } from "@inertiajs/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Separator } from "@/Components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/ui/sidebar";
import RequestForm from "@/Components/Request_form";
import { Toaster } from "@/Components/ui/toaster";

export default function RequestPage() {
  const { auth } = usePage();
  const isAdmin = auth?.user?.roles?.some(role => role.name === 'admin');
  const Sidebar = isAdmin ? AdminSidebar : AppSidebar;

  return (
    <SidebarProvider>
      <Sidebar />
      <Toaster />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Request Application</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gradient-to-br from-blue-50 to-slate-50">
          <div className="rounded-xl border-2 border-blue-200 bg-white shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Submit New Request</h2>
              <p className="text-blue-600">Fill out the form below to submit your land certification request</p>
            </div>
            <RequestForm />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
