"use client";

import { useEffect, useState } from "react";
import { History, User, Package, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Activity {
    _id: string;
    type: string;
    action: string;
    userName: string;
    details: string;
    timestamp: string;
    icon?: string;
}

export function ActivityLog() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const response = await api.axiosInstance.get('/api/v1/dashboard/activity');
                if (response.data) {
                    setActivities(response.data.slice(0, 10)); // Show last 10
                }
            } catch (error) {
                console.error("Failed to fetch activities", error);
                // Fallback to recent operations if activity log doesn't exist yet
                fetchFallbackActivities();
            } finally {
                setIsLoading(false);
            }
        }

        async function fetchFallbackActivities() {
            try {
                const response = await api.axiosInstance.get('/api/v1/stock-movements?limit=10');
                if (response.data) {
                    const moves = response.data;
                    const formatted = moves.map((move: any) => ({
                        _id: move._id,
                        type: move.type,
                        action: `${move.type} ${move.status}`,
                        userName: move.createdBy?.name || "System",
                        details: `${move.type.charAt(0).toUpperCase() + move.type.slice(1)} operation`,
                        timestamp: move.createdAt
                    }));
                    setActivities(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch fallback activities", error);
            }
        }

        fetchActivities();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "receipt": return <TrendingUp className="h-4 w-4 text-green-600" />;
            case "delivery": return <TrendingDown className="h-4 w-4 text-blue-600" />;
            case "transfer": return <Package className="h-4 w-4 text-purple-600" />;
            case "adjustment": return <MapPin className="h-4 w-4 text-amber-600" />;
            case "user": return <User className="h-4 w-4 text-gray-600" />;
            default: return <History className="h-4 w-4 text-gray-600" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case "receipt": return "border-green-200 bg-green-50";
            case "delivery": return "border-blue-200 bg-blue-50";
            case "transfer": return "border-purple-200 bg-purple-50";
            case "adjustment": return "border-amber-200 bg-amber-50";
            default: return "border-gray-200 bg-gray-50";
        }
    };

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now.getTime() - time.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return time.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <History className="h-5 w-5 text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <Badge variant="secondary" className="ml-auto">
                    Live
                </Badge>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {activities.length === 0 ? (
                    <div className="text-center py-8">
                        <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No recent activity</p>
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <div
                            key={activity._id}
                            className={`relative p-3 rounded-lg border ${getActivityColor(activity.type)} transition-all hover:shadow-sm`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 mt-0.5">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.details || activity.action}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <User className="h-3 w-3 text-gray-500" />
                                        <span className="text-xs text-gray-600">
                                            {activity.userName}
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">
                                            {formatTimeAgo(activity.timestamp)}
                                        </span>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="text-xs capitalize"
                                >
                                    {activity.type}
                                </Badge>
                            </div>
                            {/* Connection line for timeline effect */}
                            {index < activities.length - 1 && (
                                <div className="absolute left-5 top-12 w-0.5 h-4 bg-gray-200" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
