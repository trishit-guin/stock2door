"use client";

import { useEffect, useState } from "react";
import { DashboardBanner } from "@/components/Dashboard/DashboardBanner";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { QuickActionCard } from "@/components/Dashboard/QuickActionCard";
import { MyOperations } from "@/components/Dashboard/MyOperations";
import { LowStockAlert } from "@/components/Dashboard/LowStockAlert";
import { ActivityLog } from "@/components/Dashboard/ActivityLog";
import { Package, AlertTriangle, ClipboardList, Truck, Warehouse as WarehouseIcon, TrendingUp, Plus, PackagePlus } from "lucide-react";

interface DashboardStats {
    totalProducts: number;
    totalStock: number;
    lowStockItems: number;
    totalWarehouses: number;
    pendingMoves: number;
    totalMoves: number;
    recentMoves: any[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<"manager" | "staff" | null>(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch user info
                const userRes = await fetch("/api/auth/me");
                if (userRes.ok) {
                    const userData = await userRes.json();
                    const role = userData.user.role;
                    setUserRole(role);
                    setUserName(userData.user.firstName || userData.user.email?.split('@')[0] || "there");
                    
                    // Redirect staff to their dashboard
                    if (role === "staff") {
                        window.location.href = "/staff-dashboard";
                        return;
                    }
                }

                // Fetch stats (only for managers)
                const statsRes = await fetch("/api/dashboard/stats");
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                } else {
                    setError("Failed to load dashboard statistics");
                }
            } catch (err) {
                setError("An error occurred while loading data");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
        
        // Auto-refresh stats every 30 seconds
        const interval = setInterval(() => {
            fetch("/api/dashboard/stats")
                .then(res => res.ok ? res.json() : null)
                .then(data => data && setStats(data))
                .catch(console.error);
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <DashboardBanner userName={userName} />
                <div className="grid gap-8 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="space-y-8">
                <DashboardBanner userName={userName} />
                <div className="p-8 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 font-medium">{error || "Failed to load dashboard"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <DashboardBanner userName={userName} />

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatsCard
                    index={0}
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="text-blue-500"
                    description="Active items in inventory"
                    href="/products"
                />
                <StatsCard
                    index={1}
                    title="Total Stock"
                    value={stats.totalStock}
                    icon={TrendingUp}
                    color="text-green-500"
                    description="Total units across warehouses"
                    href="/stock"
                />
                <StatsCard
                    index={2}
                    title="Low Stock Items"
                    value={stats.lowStockItems}
                    icon={AlertTriangle}
                    color="text-red-500"
                    description="Items below minimum level"
                    href="/stock"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <StatsCard
                    index={3}
                    title="Pending Receipts"
                    value={stats.pendingMoves}
                    icon={ClipboardList}
                    color="text-orange-500"
                    description="Receipts waiting to process"
                    href="/operations/receipts"
                />
                <StatsCard
                    index={4}
                    title="Pending Deliveries"
                    value={0}
                    icon={Truck}
                    color="text-purple-500"
                    description="Orders ready to ship"
                    href="/operations/deliveries"
                />
            </div>

            {/* Widgets Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                <LowStockAlert />
                <ActivityLog />
            </div>

            {/* My Operations Table */}
            <MyOperations />
        </div>
    );
}
