"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function AdjustmentsPage() {
    const router = useRouter();
    const [adjustments, setAdjustments] = useState<any[]>([]);
    const [filteredAdjustments, setFilteredAdjustments] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [warehouseFilter, setWarehouseFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        async function fetchAdjustments() {
            try {
                const [adjustmentsRes, warehousesRes] = await Promise.all([
                    fetch("/api/adjustments"),
                    fetch("/api/warehouses")
                ]);
                
                if (adjustmentsRes.ok) {
                    const data = await adjustmentsRes.json();
                    setAdjustments(data);
                    setFilteredAdjustments(data);
                }
                
                if (warehousesRes.ok) {
                    const whData = await warehousesRes.json();
                    setWarehouses(whData);
                }
            } catch (error) {
                console.error("Failed to fetch adjustments", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAdjustments();
    }, []);

    useEffect(() => {
        let filtered = adjustments;

        if (searchQuery) {
            filtered = filtered.filter(
                (a) => a._id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((a) => a.status === statusFilter);
        }

        if (warehouseFilter !== "all") {
            filtered = filtered.filter((a) => a.destinationLocation?._id === warehouseFilter);
        }

        if (dateFrom) {
            filtered = filtered.filter((a) => new Date(a.createdAt) >= new Date(dateFrom));
        }

        if (dateTo) {
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59);
            filtered = filtered.filter((a) => new Date(a.createdAt) <= endDate);
        }

        setFilteredAdjustments(filtered);
    }, [searchQuery, statusFilter, warehouseFilter, dateFrom, dateTo, adjustments]);

    async function validateAdjustment(id: string) {
        try {
            const res = await fetch("/api/adjustments", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                // Refresh list
                const updated = adjustments.map(a => a._id === id ? { ...a, status: "done" } : a);
                setAdjustments(updated);
            } else {
                const err = await res.json();
                alert(err.message || "Validation failed");
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (isLoading) return <div>Loading adjustments...</div>;

    const exportToCSV = () => {
        if (filteredAdjustments.length === 0) {
            alert("No adjustments to export");
            return;
        }

        const headers = ["Reference", "Warehouse", "Items Count", "Date", "Status"];
        const rows = filteredAdjustments.map(a => [
            `ADJ-${a._id.slice(-6)}`,
            a.destinationLocation?.name || "N/A",
            a.items?.length || 0,
            new Date(a.createdAt).toLocaleDateString(),
            a.status
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `adjustments_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stock Adjustments</h1>
                    <p className="text-muted-foreground">Adjust inventory quantities for reconciliation</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Link href="/operations/adjustments/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Adjustment
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search by reference ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-40"
                        placeholder="From date"
                    />
                    <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-40"
                        placeholder="To date"
                    />
                    <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Warehouse" />
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="waiting">Waiting</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Items Count</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAdjustments.map((adjustment) => (
                            <TableRow 
                                key={adjustment._id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => router.push(`/operations/adjustments/${adjustment._id}`)}
                            >
                                <TableCell className="font-medium">ADJ-{adjustment._id.slice(-6)}</TableCell>
                                <TableCell>{adjustment.destinationLocation?.name || "N/A"}</TableCell>
                                <TableCell>{adjustment.items?.length || 0} items</TableCell>
                                <TableCell>{new Date(adjustment.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            adjustment.status === "done"
                                                ? "default"
                                                : adjustment.status === "waiting"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                        className={
                                            adjustment.status === "done" ? "bg-green-600 hover:bg-green-700" : ""
                                        }
                                    >
                                        {adjustment.status.charAt(0).toUpperCase() + adjustment.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    {adjustment.status !== "done" && (
                                        <Button size="sm" onClick={() => validateAdjustment(adjustment._id)}>
                                            Validate
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredAdjustments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No adjustments found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
