import { AppSidebar } from "@/components/app-sidebar";
import { Head } from '@inertiajs/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReceiptList } from "@/Components/Receipt";

export default function Receipt({ requests }) {
    return (
        <SidebarProvider>
            <Head title="Receipt" />
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <a 
                                        href={route('dashboard')} 
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Dashboard
                                    </a>
                                </BreadcrumbItem>
                                <BreadcrumbItem>
                                    <span className="mx-2 text-gray-400">›</span>
                                </BreadcrumbItem>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Receipt</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-white">
                    <ReceiptList requests={requests} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
