"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface LowStockProduct {
    _id: string;
    name: string;
    sku: string;
    totalStock: number;
    minStock: number;
}

export function LowStockAlert() {
    const [products, setProducts] = useState<LowStockProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLowStockProducts() {
            try {
                const response = await api.axiosInstance.get('/dashboard/low-stock');
                console.log('Low Stock Alerts Response:', response.data);
                if (response.data && response.data.data) {
                    const alerts = response.data.data;
                    console.log('Low Stock Alerts Count:', alerts.length);
                    const formatted = alerts.map((alert: any) => ({
                        _id: alert._id,
                        name: alert.productId?.name || 'Unknown Product',
                        sku: alert.productId?.sku || 'N/A',
                        totalStock: alert.currentStock || 0,
                        minStock: alert.threshold || alert.minStock || 10
                    }));
                    setProducts(formatted.slice(0, 5)); // Show top 5
                }
            } catch (error) {
                console.error("Failed to fetch low stock products", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLowStockProducts();

        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchLowStockProducts, 60000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h3 className="text-xl font-bold text-gray-900">Low Stock Alerts</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Low Stock Alerts</h3>
                </div>
                <div className="text-center py-8">
                    <div className="flex justify-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-gray-600 font-medium">All products are well stocked!</p>
                    <p className="text-sm text-gray-500 mt-1">No items below minimum stock level</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h3 className="text-xl font-bold text-gray-900">Low Stock Alerts</h3>
                    <Badge variant="destructive" className="bg-red-500">
                        {products.length}
                    </Badge>
                </div>
                <Link href="/stock">
                    <Button variant="ghost" size="sm">
                        View All
                    </Button>
                </Link>
            </div>

            <div className="space-y-2">
                {products.map((product) => {
                    const stockPercentage = (product.totalStock / product.minStock) * 100;
                    const isVeryLow = stockPercentage < 50;

                    return (
                        <Link
                            key={product._id}
                            href={`/products/${product._id}/edit`}
                            className="block p-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {product.name}
                                        </p>
                                        {isVeryLow && (
                                            <Badge variant="destructive" className="text-xs">
                                                Critical
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        SKU: {product.sku}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end ml-4">
                                    <span className={`text-2xl font-bold ${isVeryLow ? 'text-red-600' : 'text-amber-600'}`}>
                                        {product.totalStock}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Min: {product.minStock}
                                    </span>
                                </div>
                            </div>
                            {/* Stock level indicator */}
                            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${isVeryLow ? 'bg-red-500' : 'bg-amber-500'}`}
                                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <Link href="/operations/receipts/create">
                <Button className="w-full mt-4" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Receipt to Restock
                </Button>
            </Link>
        </div>
    );
}
