"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, MapPin, Building2, Package } from "lucide-react";
import Link from "next/link";
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
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useUserRole } from "@/hooks/useUserRole";

interface Warehouse {
    _id: string;
    warehouseCode: string;
    name: string;
    warehouseType: string;
    location: {
        street?: string;
        city: string;
        state: string;
        country: string;
        zipCode?: string;
    };
    inventoryId: {
        _id: string;
        name: string;
    };
    status: string;
    contactEmail?: string;
    contactPhone?: string;
}

export default function LocationsPage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { userRole, isReadOnly } = useUserRole();

    useEffect(() => {
        fetchWarehouses();
    }, []);

    useEffect(() => {
        let filtered = warehouses;

        if (searchQuery) {
            filtered = filtered.filter(
                (wh) =>
                    wh.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    wh.warehouseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    wh.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    wh.location?.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    wh.location?.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    wh.inventoryId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredWarehouses(filtered);
    }, [searchQuery, warehouses]);

    async function fetchWarehouses() {
        setIsLoading(true);
        try {
            const response = await api.axiosInstance.get('/warehouses');
            if (response.data) {
                const warehousesData = response.data.data || response.data;
                const warehouseArray = Array.isArray(warehousesData) ? warehousesData : [];
                setWarehouses(warehouseArray);
                setFilteredWarehouses(warehouseArray);
            }
        } catch (error) {
            console.error("Failed to fetch warehouses", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteWarehouse(id: string) {
        if (!confirm("Are you sure you want to delete this warehouse?")) return;

        try {
            await api.axiosInstance.delete(`/warehouses/${id}`);
            setWarehouses(warehouses.filter((wh) => wh._id !== id));
            alert('Warehouse deleted successfully');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete warehouse");
        }
    }

    if (isLoading) return <div>Loading warehouses...</div>;

    const canManage = (userRole === "admin" || userRole === "inventory_manager") && !isReadOnly;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
                    <p className="text-muted-foreground">
                        {canManage 
                            ? "Manage warehouses and their locations"
                            : "View warehouses and locations"}
                    </p>
                </div>
                {canManage && (
                    <Link href="/operations/warehouse/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Warehouse
                        </Button>
                    </Link>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                        <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Warehouses</p>
                        <h3 className="text-2xl font-bold">{warehouses.length}</h3>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-full">
                        <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Unique Locations</p>
                        <h3 className="text-2xl font-bold">
                            {new Set(warehouses.map(wh => `${wh.location?.city}, ${wh.location?.country}`)).size}
                        </h3>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 flex items-center space-x-4">
                    <div className="p-2 bg-purple-100 rounded-full">
                        <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Inventories</p>
                        <h3 className="text-2xl font-bold">
                            {new Set(warehouses.map(wh => wh.inventoryId?._id).filter(Boolean)).size}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by warehouse name, code, location, or inventory..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Warehouses Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Inventory</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            {canManage && <TableHead>Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredWarehouses.map((wh) => (
                            <TableRow key={wh._id}>
                                <TableCell className="font-mono text-sm">{wh.warehouseCode}</TableCell>
                                <TableCell className="font-medium">{wh.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {wh.inventoryId?.name || 'N/A'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="capitalize">{wh.warehouseType?.toLowerCase().replace('_', ' ') || 'N/A'}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm">
                                        <MapPin className="h-3 w-3 text-gray-400" />
                                        {wh.location?.city}, {wh.location?.state}, {wh.location?.country}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={wh.status === 'OPERATIONAL' ? 'default' : 'secondary'}>
                                        {wh.status || 'OPERATIONAL'}
                                    </Badge>
                                </TableCell>
                                {canManage && (
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={`/operations/warehouse/${wh._id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => deleteWarehouse(wh._id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {filteredWarehouses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={canManage ? 7 : 6} className="h-24 text-center">
                                    No warehouses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
