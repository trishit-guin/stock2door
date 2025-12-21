"use client";

import { useEffect, useState } from "react";
import { DashboardBanner } from "@/components/Dashboard/DashboardBanner";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { QuickActionCard } from "@/components/Dashboard/QuickActionCard";
import { MyOperations } from "@/components/Dashboard/MyOperations";
import { LowStockAlert } from "@/components/Dashboard/LowStockAlert";
import { ActivityLog } from "@/components/Dashboard/ActivityLog";
import { Package, AlertTriangle, ClipboardList, Truck, Warehouse as WarehouseIcon, TrendingUp, Plus, PackagePlus } from "lucide-react";
import api from "@/lib/api";

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
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState("");
    const [totalWarehouses, setTotalWarehouses] = useState(0);
    const [pendingDeliveries, setPendingDeliveries] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch user info
                const userData = await api.getMe();
                if (userData) {
                    const role = userData.user?.role || userData.data?.role;
                    setUserRole(role);
                    setUserName(userData.user?.firstName || userData.data?.firstName || userData.user?.email?.split('@')[0] || "there");
                    
                    // Redirect warehouse staff to their dashboard
                    if (role === "warehouse_staff") {
                        window.location.href = "/staff-dashboard";
                        return;
                    }
                }

                // Fetch stats from backend
                const statsData = await api.getDashboardStats();
                console.log('Dashboard Stats Response:', statsData);
                if (statsData && statsData.data) {
                    console.log('Stats Data:', statsData.data);
                    setStats(statsData.data);
                } else {
                    setError("Failed to load dashboard statistics");
                }

                // Fetch warehouses count
                try {
                    const warehousesData = await api.axiosInstance.get('/warehouses');
                    console.log('Warehouses Response:', warehousesData.data);
                    if (warehousesData.data) {
                        const warehouses = warehousesData.data.data || warehousesData.data;
                        console.log('Warehouses Count:', Array.isArray(warehouses) ? warehouses.length : 0);
                        setTotalWarehouses(Array.isArray(warehouses) ? warehouses.length : 0);
                    }
                } catch (err) {
                    console.error('Failed to fetch warehouses:', err);
                }

                // Fetch pending deliveries count
                try {
                    const deliveriesData = await api.axiosInstance.get('/deliveries?status=pending');
                    console.log('Deliveries Response:', deliveriesData.data);
                    if (deliveriesData.data) {
                        const deliveries = deliveriesData.data.data || deliveriesData.data;
                        console.log('Pending Deliveries Count:', Array.isArray(deliveries) ? deliveries.length : 0);
                        setPendingDeliveries(Array.isArray(deliveries) ? deliveries.length : 0);
                    }
                } catch (err) {
                    console.error('Failed to fetch deliveries:', err);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "An error occurred while loading data");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
        
        // Auto-refresh stats every 30 seconds
        const interval = setInterval(async () => {
            try {
                const statsData = await api.getDashboardStats();
                if (statsData && statsData.data) {
                    setStats(statsData.data);
                }
                
                // Refresh warehouses
                const warehousesData = await api.axiosInstance.get('/warehouses');
                if (warehousesData.data) {
                    const warehouses = warehousesData.data.data || warehousesData.data;
                    setTotalWarehouses(Array.isArray(warehouses) ? warehouses.length : 0);
                }

                // Refresh deliveries
                const deliveriesData = await api.axiosInstance.get('/deliveries?status=pending');
                if (deliveriesData.data) {
                    const deliveries = deliveriesData.data.data || deliveriesData.data;
                    setPendingDeliveries(Array.isArray(deliveries) ? deliveries.length : 0);
                }
            } catch (err) {
                console.error(err);
            }
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <DashboardBanner userName={userName} userRole={userRole || undefined} />
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
                <DashboardBanner userName={userName} userRole={userRole || undefined} />
                <div className="p-8 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 font-medium">{error || "Failed to load dashboard"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <DashboardBanner userName={userName} userRole={userRole || undefined} />

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatsCard
                    index={0}
                    title="Total Products"
                    value={stats.totalProducts || 0}
                    icon={Package}
                    color="text-blue-500"
                    description="Active items in inventory"
                    href="/products"
                />
                <StatsCard
                    index={1}
                    title="Total Stock"
                    value={stats.totalStock || 0}
                    icon={TrendingUp}
                    color="text-green-500"
                    description="Total units across warehouses"
                    href="/stock"
                />
                <StatsCard
                    index={2}
                    title="Low Stock Items"
                    value={stats.lowStockItems || 0}
                    icon={AlertTriangle}
                    color="text-red-500"
                    description="Items below minimum level"
                    href="/stock"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatsCard
                    index={3}
                    title="Total Warehouses"
                    value={totalWarehouses}
                    icon={WarehouseIcon}
                    color="text-indigo-500"
                    description="Active warehouse locations"
                    href="/locations"
                />
                <StatsCard
                    index={4}
                    title="Pending Receipts"
                    value={stats.pendingMoves || 0}
                    icon={ClipboardList}
                    color="text-orange-500"
                    description="Receipts waiting to process"
                    href="/operations/receipts"
                />
                <StatsCard
                    index={5}
                    title="Pending Deliveries"
                    value={pendingDeliveries}
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
