"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ArrowRightLeft,
    Settings,
    User,
    LogOut,
    ChevronDown,
    Truck,
    ClipboardList,
    History,
    Warehouse,
    PlusCircle,
    MapPin,
    BarChart3,
    Route,
    Navigation,
    Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { GlobalSearch } from "./GlobalSearch";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

interface NavigationItem {
    name: string;
    href?: string;
    icon: any;
    color: string;
    bgColor: string;
    activeColor: string;
    children?: Array<{ 
        name: string; 
        href: string; 
        icon: any; 
        managerOnly?: boolean;
        staffOnly?: boolean;
    }>;
    managerOnly?: boolean;
    staffOnly?: boolean;
}

const navigation: NavigationItem[] = [
    {
        name: "Home",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20"
    },
    {
        name: "Products",
        href: "/products",
        icon: Package,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20"
    },
    {
        name: "Stock Overview",
        href: "/stock",
        icon: ClipboardList,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20"
    },
    {
        name: "Operations",
        icon: ArrowRightLeft,
        color: "text-green-600",
        bgColor: "bg-green-50",
        activeColor: "bg-green-50 text-green-600 border-green-200",
        children: [
            { name: "Receipts", href: "/operations/receipts", icon: ClipboardList },
            { name: "Deliveries", href: "/operations/deliveries", icon: Truck },
            { name: "Transfers", href: "/operations/transfers", icon: ArrowRightLeft },
            { name: "Adjustments", href: "/operations/adjustments", icon: Settings },
            { name: "Move History", href: "/operations/moves", icon: History },
        ],
    },
    {
        name: "Route Optimizer",
        href: "/optimizer",
        icon: Route,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        activeColor: "bg-purple-50 text-purple-600 border-purple-200",
        managerOnly: true
    },
    {
        name: "Fleet Management",
        href: "/fleet",
        icon: Truck,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        activeColor: "bg-orange-50 text-orange-600 border-orange-200",
        managerOnly: true
    },
    {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        activeColor: "bg-blue-50 text-blue-600 border-blue-200",
        managerOnly: true
    },
    {
        name: "Sustainability",
        href: "/sustainability",
        icon: Leaf,
        color: "text-green-700",
        bgColor: "bg-green-50",
        activeColor: "bg-green-50 text-green-700 border-green-200",
        managerOnly: true
    },
    {
        name: "Warehouses",
        href: "/locations",
        icon: Warehouse,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20",
        managerOnly: true
    },
    {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20",
        managerOnly: true
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        color: "text-slate-600",
        bgColor: "bg-slate-100",
        activeColor: "bg-slate-100 text-slate-600 border-slate-200",
        managerOnly: true
    },
];

interface SidebarProps {
    onProfileClick?: () => void;
}

export function Sidebar({ onProfileClick }: SidebarProps = {}) {
    const pathname = usePathname();
    const [operationsOpen, setOperationsOpen] = useState(true);
    const [userRole, setUserRole] = useState<"manager" | "staff" | null>(null);

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUserRole(data.user.role);
                }
            } catch (error) {
                console.error("Failed to fetch user role:", error);
            }
        }
        fetchUserRole();
    }, []);

    // Filter navigation based on role
    const filteredNavigation = navigation.filter(item => {
        if (item.managerOnly && userRole === "staff") {
            return false;
        }
        if (item.staffOnly && userRole === "manager") {
            return false;
        }
        return true;
    }).map(item => {
        // Update Home link based on role
        if (item.name === "Home") {
            return { 
                ...item, 
                href: userRole === "staff" ? "/staff-dashboard" : "/dashboard" 
            };
        }
        // Filter children based on role
        if (item.children) {
            return {
                ...item,
                children: item.children.filter(child => {
                    if (child.managerOnly && userRole === "staff") {
                        return false;
                    }
                    return true;
                })
            };
        }
        return item;
    });

    return (
        <div className="flex h-screen w-72 flex-col bg-white text-slate-600">
            <div className="flex h-20 items-center px-6">
                <Link href="/">
                    <Logo size={40} showText={true} className="cursor-pointer hover:opacity-80 transition-opacity" />
                </Link>
            </div>

            {/* Global Search */}
            <div className="px-4 pb-4">
                <GlobalSearch />
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                <nav className="space-y-2">
                    {filteredNavigation.map((item) => {
                        // For Home navigation, check against both dashboard routes based on role
                        const homeRoutes = ["/dashboard", "/staff-dashboard"];
                        const isHomeActive = item.name === "Home" && homeRoutes.includes(pathname);
                        const isActive = isHomeActive || pathname === item.href || (item.children && item.children.some(child => pathname === child.href));

                        return (
                            <div key={item.name}>
                                {item.children ? (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => setOperationsOpen(!operationsOpen)}
                                            className={cn(
                                                "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-200",
                                                isActive
                                                    ? item.activeColor + " border shadow-sm"
                                                    : "hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("p-2 rounded-lg", item.bgColor)}>
                                                    <item.icon className={cn("h-5 w-5", item.color)} />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span>{item.name}</span>
                                                    <span className="text-xs font-normal text-muted-foreground">
                                                        {item.name === "Operations" ? "Stock operations" : "Management"}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform duration-200",
                                                    operationsOpen ? "rotate-180" : ""
                                                )}
                                            />
                                        </button>

                                        <div className={cn(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            operationsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        )}>
                                            <div className="mt-2 space-y-1 pl-16 pr-2">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={cn(
                                                            "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                            pathname === child.href
                                                                ? "bg-slate-100 text-slate-900"
                                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                        )}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href!}
                                        className={cn(
                                            "group flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 border border-transparent",
                                            isActive
                                                ? item.activeColor + " border shadow-sm"
                                                : "hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-lg mr-4", item.bgColor)}>
                                            <item.icon className={cn("h-6 w-6", item.color)} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{item.name}</span>
                                            <span className="text-xs font-normal text-muted-foreground opacity-80">
                                                {item.name === "Home" ? "Dashboard overview" :
                                                    item.name === "Products" ? "Manage inventory" :
                                                    item.name === "Stock Overview" ? "View all stock" :
                                                    item.name === "Route Optimizer" ? "Optimize deliveries" :
                                                    item.name === "Fleet Management" ? "Track vehicles" :
                                                    item.name === "Analytics" ? "Insights & reports" :
                                                    item.name === "Sustainability" ? "Emissions tracking" :
                                                    item.name === "Warehouses" ? "Location management" :
                                                    item.name === "Reports" ? "Generate reports" :
                                                    item.name === "Settings" ? "Optimization settings" : ""}
                                            </span>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Profile Section at Bottom */}
            <div className="border-t border-gray-200 p-4">
                <Button
                    variant="ghost"
                    onClick={onProfileClick}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 h-auto justify-start hover:bg-slate-50"
                >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1A73E8] to-[#1557b0] flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-slate-900 truncate">My Profile</p>
                        <p className="text-xs text-slate-500 truncate">{userRole === "manager" ? "Manager" : "Staff"}</p>
                    </div>
                </Button>
            </div>
        </div>
    );
}