import { AppSidebar } from "@/components/app-sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Dashboard } from "@/components/Dashboard"
import { Head, usePage } from '@inertiajs/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page({ requests = [] }) {
  const { auth } = usePage().props;
  const isAdmin = auth?.user?.roles?.some(role => role.name === 'admin');
  const Sidebar = isAdmin ? AdminSidebar : AppSidebar;

  return (
    <SidebarProvider>
      <Head title="Dashboard" />
      <Sidebar />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col min-h-screen bg-white">
          <div className="flex-1 p-6">
            <Dashboard requests={requests} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
