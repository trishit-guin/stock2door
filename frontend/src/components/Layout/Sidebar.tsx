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
    Leaf,
    Users,
    Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { GlobalSearch } from "./GlobalSearch";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

type UserRole = 'admin' | 'inventory_manager' | 'warehouse_staff' | 'environment_manager' | 'auditor';

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
        roles?: UserRole[];
    }>;
    roles?: UserRole[];
}

const navigation: NavigationItem[] = [
    {
        name: "Home",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20",
        roles: ['admin', 'inventory_manager', 'warehouse_staff']
    },
    {
        name: "Products",
        href: "/products",
        icon: Package,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20",
        roles: ['admin', 'inventory_manager', 'warehouse_staff']
    },
    {
        name: "Stock Overview",
        href: "/stock",
        icon: ClipboardList,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20",
        roles: ['admin', 'inventory_manager', 'warehouse_staff']
    },
    {
        name: "Operations",
        icon: ArrowRightLeft,
        color: "text-green-600",
        bgColor: "bg-green-50",
        activeColor: "bg-green-50 text-green-600 border-green-200",
        roles: ['admin', 'warehouse_staff'],
        children: [
            { name: "Receipts", href: "/operations/receipts", icon: ClipboardList, roles: ['admin', 'warehouse_staff'] },
            { name: "Invoice Generation", href: "/operations/invoices", icon: ClipboardList, roles: ['admin', 'warehouse_staff'] },
            { name: "Deliveries", href: "/operations/deliveries", icon: Truck, roles: ['admin', 'warehouse_staff'] },
            { name: "Smart Route", href: "/routes", icon: Route, roles: ['admin', 'warehouse_staff'] },
            { name: "Fleet Management", href: "/fleet", icon: Truck, roles: ['admin', 'warehouse_staff'] },
            { name: "Internal Transfers", href: "/operations/transfers", icon: ArrowRightLeft, roles: ['admin', 'warehouse_staff'] },
            { name: "Adjustments", href: "/operations/adjustments", icon: Settings, roles: ['admin', 'warehouse_staff'] },
            { name: "Move History", href: "/operations/moves", icon: History, roles: ['admin', 'warehouse_staff'] },
        ],
    },
    {
        name: "Warehouses",
        href: "/locations",
        icon: Warehouse,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20",
        roles: ['admin', 'inventory_manager']
    },
    {
        name: "Inventories",
        href: "/inventories",
        icon: Building,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        activeColor: "bg-purple-50 text-purple-600 border-purple-200",
        roles: ['admin']
    },
    {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        activeColor: "bg-blue-50 text-blue-600 border-blue-200",
        roles: ['admin', 'inventory_manager', 'environment_manager']
    },
    {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
        color: "text-[#1A73E8]",
        bgColor: "bg-[#1A73E8]/10",
        activeColor: "bg-[#1A73E8]/10 text-[#1A73E8] border-[#1A73E8]/20",
        roles: ['admin', 'inventory_manager', 'auditor']
    },
    {
        name: "User Management",
        href: "/users",
        icon: Users,
        color: "text-slate-600",
        bgColor: "bg-slate-100",
        activeColor: "bg-slate-100 text-slate-600 border-slate-200",
        roles: ['admin']
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        color: "text-slate-600",
        bgColor: "bg-slate-100",
        activeColor: "bg-slate-100 text-slate-600 border-slate-200",
        roles: ['admin', 'inventory_manager']
    },
];

interface SidebarProps {
    onProfileClick?: () => void;
}

export function Sidebar({ onProfileClick }: SidebarProps = {}) {
    const pathname = usePathname();
    const [warehouseOpsOpen, setWarehouseOpsOpen] = useState(true);
    const [logisticsOpsOpen, setLogisticsOpsOpen] = useState(true);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const response = await api.axiosInstance.get('/auth/me');
                if (response.data) {
                    const role = response.data.user?.role || response.data.data?.role || response.data.role;
                    setUserRole(role);
                }
            } catch (error) {
                console.error("Failed to fetch user role:", error);
                setUserRole('warehouse_staff' as UserRole); // Default fallback
            }
        }
        fetchUserRole();
    }, []);

    // Filter navigation based on role
    const filteredNavigation = navigation.filter(item => {
        if (!userRole) return false; // Don't show anything if role is not determined
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    }).map(item => {
        // Filter children based on role
        if (item.children && userRole) {
            return {
                ...item,
                children: item.children.filter(child => {
                    if (!child.roles) return true;
                    return child.roles.includes(userRole);
                })
            };
        }
        return item;
    });

    const getRoleDisplayName = (role: UserRole | null): string => {
        if (!role) return 'User';
        const roleMap: Record<UserRole, string> = {
            'admin': 'Admin',
            'inventory_manager': 'Inventory Manager',
            'warehouse_staff': 'Warehouse Staff',
            'environment_manager': 'Environment Manager',
            'auditor': 'Auditor'
        };
        return roleMap[role] || 'User';
    };

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
                        const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));

                        return (
                            <div key={item.name}>
                                {item.children ? (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => {
                                                if (item.name === "Warehouse Operations") {
                                                    setWarehouseOpsOpen(!warehouseOpsOpen);
                                                } else if (item.name === "Logistics Operations") {
                                                    setLogisticsOpsOpen(!logisticsOpsOpen);
                                                }
                                            }}
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
                                                        {item.name === "Warehouse Operations" ? "Stock operations" : "Delivery & routes"}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform duration-200",
                                                    (item.name === "Warehouse Operations" ? warehouseOpsOpen : logisticsOpsOpen) ? "rotate-180" : ""
                                                )}
                                            />
                                        </button>

                                        <div className={cn(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            (item.name === "Warehouse Operations" ? warehouseOpsOpen : logisticsOpsOpen) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
                                                    item.name === "Warehouses" ? "Location management" :
                                                    item.name === "Analytics" ? "Insights & data" :
                                                    item.name === "Reports" ? "Generate reports" :
                                                    item.name === "User Management" ? "Manage users" :
                                                    item.name === "Settings" ? "App settings" : ""}
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
                        <p className="text-xs text-slate-500 truncate">{getRoleDisplayName(userRole)}</p>
                    </div>
                </Button>
            </div>
        </div>
    );
}