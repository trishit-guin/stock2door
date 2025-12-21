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
import api from "@/lib/api";
import { useUserRole } from "@/hooks/useUserRole";

export default function TransfersPage() {
    const router = useRouter();
    const [transfers, setTransfers] = useState<any[]>([]);
    const [filteredTransfers, setFilteredTransfers] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [warehouseFilter, setWarehouseFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const { isReadOnly } = useUserRole();

    useEffect(() => {
        async function fetchTransfers() {
            try {
                const [transfersRes, warehousesRes] = await Promise.all([
                    api.axiosInstance.get('/movements?type=transfer'),
                    api.axiosInstance.get('/warehouses')
                ]);
                
                if (transfersRes.data) {
                    setTransfers(transfersRes.data);
                    setFilteredTransfers(transfersRes.data);
                }
                
                if (warehousesRes.data) {
                    setWarehouses(warehousesRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch transfers", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTransfers();
    }, []);

    useEffect(() => {
        let filtered = transfers;

        if (searchQuery) {
            filtered = filtered.filter(
                (t) => t._id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((t) => t.status === statusFilter);
        }

        if (warehouseFilter !== "all") {
            filtered = filtered.filter((t) => 
                t.sourceLocation?._id === warehouseFilter || 
                t.destinationLocation?._id === warehouseFilter
            );
        }

        if (dateFrom) {
            filtered = filtered.filter((t) => new Date(t.date) >= new Date(dateFrom));
        }

        if (dateTo) {
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59);
            filtered = filtered.filter((t) => new Date(t.date) <= endDate);
        }

        setFilteredTransfers(filtered);
    }, [searchQuery, statusFilter, warehouseFilter, dateFrom, dateTo, transfers]);

    if (isLoading) return <div>Loading transfers...</div>;

    const exportToCSV = () => {
        if (filteredTransfers.length === 0) {
            alert("No transfers to export");
            return;
        }

        const headers = ["Reference", "Source", "Destination", "Date", "Status", "Items Count"];
        const rows = filteredTransfers.map(t => [
            `TRF-${t._id.slice(-6)}`,
            t.sourceLocation?.name || "N/A",
            t.destinationLocation?.name || "N/A",
            new Date(t.date).toLocaleDateString(),
            t.status,
            t.items?.length || 0
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `transfers_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Internal Transfers</h1>
                    <p className="text-muted-foreground">Move stock between warehouse locations</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Link href="/operations/transfers/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Transfer
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
                            <TableHead>Source Location</TableHead>
                            <TableHead>Destination Location</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransfers.map((transfer) => (
                            <TableRow 
                                key={transfer._id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => router.push(`/operations/transfers/${transfer._id}`)}
                            >
                                <TableCell className="font-medium">TRF-{transfer._id.slice(-6)}</TableCell>
                                <TableCell>{transfer.sourceLocation?.name || "N/A"}</TableCell>
                                <TableCell>{transfer.destinationLocation?.name || "N/A"}</TableCell>
                                <TableCell>{new Date(transfer.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            transfer.status === "done"
                                                ? "default"
                                                : transfer.status === "waiting"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                        className={
                                            transfer.status === "done" ? "bg-green-600 hover:bg-green-700" : ""
                                        }
                                    >
                                        {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTransfers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No transfers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
