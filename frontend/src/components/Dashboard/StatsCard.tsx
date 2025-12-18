import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    color?: string;
    index?: number;
    href?: string;
}

export function StatsCard({ title, value, icon: Icon, description, color = "text-blue-500", index = 0, href }: StatsCardProps) {
    // Map color classes to actual hex colors for consistent display
    const colorMap: Record<string, string> = {
        "text-blue-500": "#3b82f6",
        "text-green-500": "#10b981",
        "text-red-500": "#ef4444",
        "text-orange-500": "#f97316",
        "text-purple-500": "#a855f7",
    };

    const hexColor = colorMap[color] || "#3b82f6";

    const content = (
        <div className="flex flex-col items-center text-center space-y-3">
            <div className="rounded-lg p-3" style={{ backgroundColor: `${hexColor}15` }}>
                <Icon className="h-7 w-7" style={{ color: hexColor }} />
            </div>
            <div>
                <p className="text-3xl font-bold" style={{ color: hexColor }}>{value}</p>
                <p className="mt-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</p>
                {description && (
                    <p className="mt-1 text-xs text-gray-500">{description}</p>
                )}
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href}>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300 cursor-pointer">
                    {content}
                </div>
            </Link>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            {content}
        </div>
    );
}
