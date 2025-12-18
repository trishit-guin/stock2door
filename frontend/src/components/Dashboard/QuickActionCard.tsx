import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
    bgColor: string;
}

export function QuickActionCard({ title, description, icon: Icon, href, color, bgColor }: QuickActionCardProps) {
    // Map bright colors to subtle pastels
    const subtleBgMap: Record<string, string> = {
        "bg-green-50": "bg-green-50",
        "bg-blue-50": "bg-blue-50",
        "bg-purple-50": "bg-purple-50",
        "bg-orange-50": "bg-orange-50",
    };

    const subtleIconMap: Record<string, string> = {
        "bg-green-500": "bg-green-500",
        "bg-blue-500": "bg-blue-500",
        "bg-purple-500": "bg-purple-500",
        "bg-orange-500": "bg-orange-500",
    };

    return (
        <Link href={href}>
            <Card className={`group relative overflow-hidden rounded-xl ${subtleBgMap[bgColor] || bgColor} p-6 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2 border-gray-200`}>
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-lg ${subtleIconMap[color] || color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
                        <p className="text-sm text-slate-600">{description}</p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
