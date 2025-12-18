"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus, Search, Filter } from "lucide-react";
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

export default function ReceiptsPage() {
    const router = useRouter();
    const [receipts, setReceipts] = useState<any[]>([]);
    const [filteredReceipts, setFilteredReceipts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [warehouseFilter, setWarehouseFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        async function fetchReceipts() {
            try {
                const [receiptsRes, warehousesRes] = await Promise.all([
                    fetch("/api/moves?type=receipt"),
                    fetch("/api/warehouses")
                ]);
                
                if (receiptsRes.ok) {
                    const data = await receiptsRes.json();
                    setReceipts(data);
                    setFilteredReceipts(data);
                }
                
                if (warehousesRes.ok) {
                    const whData = await warehousesRes.json();
                    setWarehouses(whData);
                }
            } catch (error) {
                console.error("Failed to fetch receipts", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReceipts();
    }, []);

    useEffect(() => {
        let filtered = receipts;

        if (searchQuery) {
            filtered = filtered.filter(
                (r) =>
                    r._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.partnerName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((r) => r.status === statusFilter);
        }

        if (warehouseFilter !== "all") {
            filtered = filtered.filter((r) => r.destinationLocation?._id === warehouseFilter);
        }

        if (dateFrom) {
            filtered = filtered.filter((r) => new Date(r.date) >= new Date(dateFrom));
        }

        if (dateTo) {
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59);
            filtered = filtered.filter((r) => new Date(r.date) <= endDate);
        }

        setFilteredReceipts(filtered);
    }, [searchQuery, statusFilter, warehouseFilter, dateFrom, dateTo, receipts]);

    async function validateReceipt(id: string) {
        try {
            const res = await fetch("/api/moves", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: "done" }),
            });
            if (res.ok) {
                // Refresh list
                const updated = receipts.map(r => r._id === id ? { ...r, status: "done" } : r);
                setReceipts(updated);
            } else {
                const err = await res.json();
                alert(err.message || "Validation failed");
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (isLoading) return <div>Loading receipts...</div>;

    const exportToCSV = () => {
        if (filteredReceipts.length === 0) {
            alert("No receipts to export");
            return;
        }

        const headers = ["Reference", "Vendor", "Warehouse", "Date", "Status", "Items Count"];
        const rows = filteredReceipts.map(r => [
            `RCP-${r._id.slice(-6)}`,
            r.partnerName || "N/A",
            r.destinationLocation?.name || "N/A",
            new Date(r.date).toLocaleDateString(),
            r.status,
            r.items?.length || 0
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `receipts_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Receipts</h1>
                    <p className="text-muted-foreground">Manage incoming stock from vendors</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Link href="/operations/receipts/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Receipt
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search by ID or vendor..."
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
                            <TableHead>Source Document</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReceipts.map((receipt) => (
                            <TableRow 
                                key={receipt._id} 
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => router.push(`/operations/receipts/${receipt._id}`)}
                            >
                                <TableCell className="font-medium">REC-{receipt._id.slice(-6)}</TableCell>
                                <TableCell>PO-{receipt._id.slice(-4)}</TableCell>
                                <TableCell>{receipt.partnerName || "N/A"}</TableCell>
                                <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            receipt.status === "done"
                                                ? "default"
                                                : receipt.status === "waiting"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                        className={
                                            receipt.status === "done" ? "bg-green-600 hover:bg-green-700" : ""
                                        }
                                    >
                                        {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    {receipt.status !== "done" && (
                                        <Button size="sm" onClick={() => validateReceipt(receipt._id)}>
                                            Validate
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredReceipts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No receipts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
