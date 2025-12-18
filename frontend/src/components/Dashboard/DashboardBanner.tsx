import { Package } from "lucide-react";

interface DashboardBannerProps {
    userName?: string;
}

export function DashboardBanner({ userName = "there" }: DashboardBannerProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-50 via-gray-50 to-slate-100 border border-gray-200 p-8 md:p-12 text-center">
            <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 shadow-md mb-4 mx-auto">
                    <Package className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome back, {userName}! 👋</h1>
                <p className="text-lg text-slate-600">Inventory Manager Dashboard - Oversee and optimize inventory operations</p>
            </div>
        </div>
    );
}
