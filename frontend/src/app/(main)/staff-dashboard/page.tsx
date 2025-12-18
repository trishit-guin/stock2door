"use client";

import { useEffect, useState } from "react";
import { QuickActionCard } from "@/components/Dashboard/QuickActionCard";
import { MyOperations } from "@/components/Dashboard/MyOperations";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { Package, AlertTriangle, ClipboardList, CheckCircle2, Truck, ArrowRightLeft, Settings, PackagePlus } from "lucide-react";

interface StaffStats {
    totalProducts: number;
    lowStockItems: number;
    myPendingOperations: number;
    todayCompleted: number;
}

export default function StaffDashboard() {
    const [stats, setStats] = useState<StaffStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);

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
                    
                    // Redirect managers to their dashboard
                    if (role === "manager") {
                        window.location.href = "/dashboard";
                        return;
                    }
                }

                // Fetch stats
                const statsRes = await fetch("/api/dashboard/stats");
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats({
                        totalProducts: data.totalProducts || 0,
                        lowStockItems: data.lowStockItems || 0,
                        myPendingOperations: data.pendingMoves || 0,
                        todayCompleted: data.todayCompleted || 0
                    });
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
        
        // Auto-refresh stats every 30 seconds
        const interval = setInterval(() => {
            fetch("/api/dashboard/stats")
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) {
                        setStats({
                            totalProducts: data.totalProducts || 0,
                            lowStockItems: data.lowStockItems || 0,
                            myPendingOperations: data.pendingMoves || 0,
                            todayCompleted: data.todayCompleted || 0
                        });
                    }
                })
                .catch(console.error);
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-50 via-gray-50 to-slate-100 border border-gray-200 p-8 md:p-12 text-center">
                <div className="relative z-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 shadow-md mb-4 mx-auto">
                        <Package className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome back, {userName}! 👋</h1>
                    <p className="text-lg text-slate-600">Warehouse Staff Dashboard - Manage your daily operations</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <QuickActionCard
                        title="New Receipt"
                        description="Record incoming goods"
                        icon={ClipboardList}
                        href="/operations/receipts/create"
                        color="bg-green-500"
                        bgColor="bg-green-50"
                    />
                    <QuickActionCard
                        title="New Delivery"
                        description="Ship outgoing goods"
                        icon={Truck}
                        href="/operations/deliveries/create"
                        color="bg-blue-500"
                        bgColor="bg-blue-50"
                    />
                    <QuickActionCard
                        title="Internal Transfer"
                        description="Move between locations"
                        icon={ArrowRightLeft}
                        href="/operations/transfers/create"
                        color="bg-purple-500"
                        bgColor="bg-purple-50"
                    />
                    <QuickActionCard
                        title="Adjustment"
                        description="Adjust inventory counts"
                        icon={Settings}
                        href="/operations/adjustments/create"
                        color="bg-orange-500"
                        bgColor="bg-orange-50"
                    />
                </div>
            </div>

            {/* Stats Row */}
            {stats && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            index={0}
                            title="Total Products"
                            value={stats.totalProducts}
                            icon={Package}
                            color="text-purple-500"
                            description="Active items"
                            href="/products"
                        />
                        <StatsCard
                            index={1}
                            title="Low Stock Items"
                            value={stats.lowStockItems}
                            icon={AlertTriangle}
                            color="text-red-500"
                            description="Need attention"
                            href="/stock"
                        />
                        <StatsCard
                            index={2}
                            title="My Pending"
                            value={stats.myPendingOperations}
                            icon={ClipboardList}
                            color="text-orange-500"
                            description="Draft operations"
                        />
                        <StatsCard
                            index={3}
                            title="Today's Done"
                            value={stats.todayCompleted}
                            icon={CheckCircle2}
                            color="text-green-500"
                            description="Completed tasks"
                        />
                    </div>
                </div>
            )}

            {/* My Recent Operations */}
            <MyOperations />
        </div>
    );
}
