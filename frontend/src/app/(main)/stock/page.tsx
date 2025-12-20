"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, TrendingUp, Warehouse as WarehouseIcon, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface StockLevel {
    warehouseId: {
        _id: string;
        name: string;
        type: string;
    };
    quantity: number;
}

interface Product {
    _id: string;
    name: string;
    sku: string;
    category: string;
    unit: string;
    totalStock: number;
    reorderLevel: number;
    lowStock: boolean;
    stockLevels: StockLevel[];
}

interface StockData {
    products: Product[];
    statistics: {
        totalProducts: number;
        totalStock: number;
        lowStockCount: number;
    };
}

export default function StockPage() {
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    useEffect(() => {
        fetchStock();
    }, [selectedWarehouse, showLowStockOnly]);

    async function fetchWarehouses() {
        try {
            const response = await api.axiosInstance.get('/api/v1/warehouses');
            if (response.data) {
                setWarehouses(response.data);
            }
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        }
    }

    async function fetchStock() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedWarehouse !== "all") {
                params.append("warehouse", selectedWarehouse);
            }
            if (showLowStockOnly) {
                params.append("lowStock", "true");
            }

            const response = await api.axiosInstance.get(`/api/v1/stock?${params}`);
            if (response.data) {
                setStockData(response.data);
            }
        } catch (error) {
            console.error("Error fetching stock:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading && !stockData) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Stock Overview</h1>
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Stock Overview</h1>
            </div>

            {/* Statistics Cards */}
            {stockData && (
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{stockData.statistics.totalProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary/10 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Stock</p>
                                <p className="text-2xl font-bold text-gray-900">{stockData.statistics.totalStock}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Low Stock Items</p>
                                <p className="text-2xl font-bold text-gray-900">{stockData.statistics.lowStockCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <span className="font-medium text-gray-700">Filters:</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="warehouse" className="text-sm">Warehouse:</Label>
                        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Warehouses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Warehouses</SelectItem>
                                {warehouses.map((wh) => (
                                    <SelectItem key={wh._id} value={wh._id}>
                                        {wh.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant={showLowStockOnly ? "default" : "outline"}
                        onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                        size="sm"
                    >
                        {showLowStockOnly ? "Showing Low Stock" : "Show Low Stock Only"}
                    </Button>
                </div>
            </div>

            {/* Stock Table */}
            {stockData && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouses</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stockData.products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    stockData.products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.category || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {product.totalStock} {product.unit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.reorderLevel}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {product.lowStock || product.totalStock < product.reorderLevel ? (
                                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                                        In Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {product.stockLevels.length === 0 ? (
                                                        <span className="text-sm text-gray-400">No stock</span>
                                                    ) : (
                                                        product.stockLevels.map((level, idx) => (
                                                            <div key={idx} className="text-sm">
                                                                <span className="font-medium text-gray-700">
                                                                    {level.warehouseId.name}:
                                                                </span>{" "}
                                                                <span className="text-gray-600">{level.quantity}</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
