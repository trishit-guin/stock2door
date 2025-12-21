"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Truck, ArrowRightLeft, Settings } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Operation {
    _id: string;
    type: string;
    status: string;
    itemCount: number;
    createdAt: string;
    sourceLocation?: string;
    destinationLocation?: string;
}

export function MyOperations() {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOperations() {
            try {
                const response = await api.axiosInstance.get('/movements?limit=10');
                console.log('My Operations Response:', response.data);
                if (response.data) {
                    const movements = response.data.data || response.data;
                    console.log('Operations Count:', Array.isArray(movements) ? movements.length : 0);
                    const formatted = Array.isArray(movements) ? movements.map((move: any) => ({
                        _id: move._id,
                        type: move.movementType || move.type || 'movement',
                        status: move.status || 'pending',
                        itemCount: move.quantity || 1,
                        createdAt: move.createdAt,
                        sourceLocation: move.sourceWarehouseId?.name || move.sourceWarehouse?.name,
                        destinationLocation: move.destinationWarehouseId?.name || move.destinationWarehouse?.name
                    })) : [];
                    setOperations(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch operations:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOperations();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchOperations, 30000);
        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case "receipt": return ClipboardList;
            case "delivery": return Truck;
            case "transfer": return ArrowRightLeft;
            case "adjustment": return Settings;
            default: return ClipboardList;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "receipt": return "bg-green-100 text-green-700";
            case "delivery": return "bg-blue-100 text-blue-700";
            case "transfer": return "bg-purple-100 text-purple-700";
            case "adjustment": return "bg-yellow-100 text-yellow-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getOperationRoute = (type: string, id: string) => {
        switch (type) {
            case "receipt": return `/operations/receipts/${id}`;
            case "delivery": return `/operations/deliveries/${id}`;
            case "transfer": return `/operations/transfers/${id}`;
            case "adjustment": return `/operations/adjustments/${id}`;
            default: return "#";
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">My Recent Operations</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">My Recent Operations</h3>
            {operations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No operations yet. Create your first one!</p>
            ) : (
                <div className="space-y-3">
                    {operations.slice(0, 5).map((operation) => {
                        const Icon = getIcon(operation.type);
                        return (
                            <Link 
                                key={operation._id}
                                href={getOperationRoute(operation.type, operation._id)}
                                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${getTypeColor(operation.type)}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {operation.itemCount} item{operation.itemCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${operation.status === 'done'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {operation.status === 'done' ? 'Validated' : 'Draft'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(operation.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
