"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp, Package, IndianRupee, BarChart3, Calendar } from "lucide-react";
import api from "@/lib/api";

export default function ReportsPage() {
    const [reportType, setReportType] = useState("value");
    const [reportData, setReportData] = useState<any>(null);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchWarehouses() {
            try {
                const response = await api.axiosInstance.get('/warehouses');
                if (response.data) {
                    setWarehouses(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch warehouses", error);
            }
        }
        fetchWarehouses();
    }, []);

    useEffect(() => {
        generateReport();
    }, [reportType, selectedWarehouse, dateFrom, dateTo]);

    async function generateReport() {
        setIsLoading(true);
        try {
            let url = `/api/v1/reports?type=${reportType}`;
            if (selectedWarehouse !== "all") {
                url += `&warehouse=${selectedWarehouse}`;
            }
            if (dateFrom) {
                url += `&dateFrom=${dateFrom}`;
            }
            if (dateTo) {
                url += `&dateTo=${dateTo}`;
            }

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setReportData(data);
            }
        } catch (error) {
            console.error("Failed to generate report", error);
        } finally {
            setIsLoading(false);
        }
    }

    function exportToCSV() {
        if (!reportData || !reportData.items) return;

        let headers: string[] = [];
        let rows: any[][] = [];

        if (reportType === "value") {
            headers = ["Product Name", "SKU", "Category", "Quantity", "UOM", "Unit Price", "Total Value"];
            rows = reportData.items.map((item: any) => [
                item.name,
                item.sku,
                item.category,
                item.quantity,
                item.uom,
                item.price?.toFixed(2) || "0.00",
                item.value?.toFixed(2) || "0.00"
            ]);
        } else if (reportType === "movement") {
            headers = ["Product Name", "SKU", "Receipts", "Deliveries", "Transfers", "Adjustments", "Net Change"];
            rows = reportData.items.map((item: any) => [
                item.name,
                item.sku,
                item.receipts,
                item.deliveries,
                item.transfers,
                item.adjustments,
                item.netChange > 0 ? `+${item.netChange}` : item.netChange
            ]);
        }

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground">Generate detailed reports and analyze inventory data</p>
                </div>
                <Button onClick={exportToCSV} disabled={!reportData?.items}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Report Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label>Report Type</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="value">Stock Value Report</SelectItem>
                                    <SelectItem value="movement">Stock Movement Report</SelectItem>
                                    <SelectItem value="summary">Summary Dashboard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {reportType !== "summary" && (
                            <div className="space-y-2">
                                <Label>Warehouse</Label>
                                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                                    <SelectTrigger>
                                        <SelectValue />
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
                        )}

                        {reportType === "movement" && (
                            <>
                                <div className="space-y-2">
                                    <Label>Date From</Label>
                                    <Input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date To</Label>
                                    <Input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            {reportData?.summary && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {reportType === "value" && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ₹{reportData.summary.totalValue?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || "0.00"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Across all products
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.summary.totalItems}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Unique products
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.summary.totalQuantity}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Total units in stock
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Average Value</CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ₹{reportData.summary.averageValue?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || "0.00"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Per product
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {reportType === "movement" && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.summary.totalMoves}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Completed operations
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Products Moved</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.summary.totalProducts}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Unique items
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Date Range</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm font-bold">
                                        {reportData.summary.dateRange?.from || "All time"}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {reportData.summary.dateRange?.to ? `to ${reportData.summary.dateRange.to}` : ""}
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {reportType === "summary" && reportData?.data && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.data.totalProducts}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        {reportData.data.lowStockProducts}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Today's Operations</CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.data.todayMoves}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.data.totalMoves}</div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            )}

            {/* Data Table */}
            {isLoading ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center text-muted-foreground">Loading report data...</div>
                    </CardContent>
                </Card>
            ) : reportData?.items && reportType === "value" ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Stock Value Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead>UOM</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Total Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.items.map((item: any) => (
                                    <TableRow key={item.productId}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.sku}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell>{item.uom}</TableCell>
                                        <TableCell className="text-right">
                                            ₹{item.price?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || "0.00"}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ₹{item.value?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || "0.00"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : reportData?.items && reportType === "movement" ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Stock Movement Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Receipts</TableHead>
                                    <TableHead className="text-right">Deliveries</TableHead>
                                    <TableHead className="text-right">Transfers</TableHead>
                                    <TableHead className="text-right">Adjustments</TableHead>
                                    <TableHead className="text-right">Net Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.items.map((item: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.sku}</TableCell>
                                        <TableCell className="text-right text-green-600">
                                            +{item.receipts}
                                        </TableCell>
                                        <TableCell className="text-right text-red-600">
                                            -{item.deliveries}
                                        </TableCell>
                                        <TableCell className="text-right">{item.transfers}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={item.adjustments >= 0 ? "text-green-600" : "text-red-600"}>
                                                {item.adjustments >= 0 ? "+" : ""}{item.adjustments}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            <span className={item.netChange >= 0 ? "text-green-600" : "text-red-600"}>
                                                {item.netChange >= 0 ? "+" : ""}{item.netChange}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : reportData?.data && reportType === "summary" ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Operations Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Operation Type</TableHead>
                                    <TableHead className="text-right">Count</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(reportData.data.movesByType || {}).map(([type, count]: [string, any]) => (
                                    <TableRow key={type}>
                                        <TableCell className="font-medium capitalize">{type}</TableCell>
                                        <TableCell className="text-right">{count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
