import * as React from "react";
import {
    Shield,
    LayoutDashboard,
    FileText,
    Users,
    Settings,
} from "lucide-react";
import { usePage } from "@inertiajs/react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { NotificationBell } from "@/Components/NotificationBell";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

const teams = [
    {
        name: "LandCert",
        logo: "/images/ilagan1.png",
        plan: "Administrator",
    },
];

const adminNavMain = [
    {
        title: "Admin Panel",
        url: "#",
        icon: Shield,
        isActive: true,
        items: [
            {
                title: "Dashboard",
                url: "/admin/dashboard",
            },
            {
                title: "Requests",
                url: "/admin/requests",
            },
            {
                title: "Payments",
                url: "/admin/payments",
            },
        ],
    },
    {
        title: "Management",
        url: "#",
        icon: Settings,
        isActive: false,
        items: [
            {
                title: "Users",
                url: "/admin/users",
            },
        ],
    },
];

export function AdminSidebar({ ...props }) {
    const { auth } = usePage().props;

    const user = {
        name: auth?.user?.name || "Admin",
        email: auth?.user?.email || "admin@example.com",
        avatar: "/avatars/default.jpg",
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={adminNavMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
