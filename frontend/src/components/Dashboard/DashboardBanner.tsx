import { Package } from "lucide-react";

interface DashboardBannerProps {
    userName?: string;
    userRole?: string;
}

export function DashboardBanner({ userName = "there", userRole = "inventory_manager" }: DashboardBannerProps) {
    const getRoleTitle = () => {
        switch(userRole) {
            case 'admin':
                return 'Admin Dashboard - Monitor and oversee all operations';
            case 'inventory_manager':
                return 'Inventory Manager Dashboard - Oversee and optimize inventory operations';
            case 'warehouse_staff':
                return 'Warehouse Operations Dashboard - Manage daily warehouse operations';
            case 'environment_manager':
                return 'Environment Manager Dashboard - Track sustainability metrics';
            case 'auditor':
                return 'Auditor Dashboard - Review and audit system activities';
            default:
                return 'Dashboard - Manage your operations';
        }
    };

    const getGreeting = () => {
        if (userRole === 'admin') {
            return `Welcome Admin, ${userName}! 👋`;
        }
        return `Welcome back, ${userName}! 👋`;
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-50 via-gray-50 to-slate-100 border border-gray-200 p-8 md:p-12 text-center">
            <div className="relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-600 shadow-md mb-4 mx-auto">
                    <Package className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">{getGreeting()}</h1>
                <p className="text-lg text-slate-600">{getRoleTitle()}</p>
            </div>
        </div>
    );
}
