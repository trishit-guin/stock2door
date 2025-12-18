"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, ChevronRight, MapPin, Building2 } from "lucide-react";
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
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Location {
    _id: string;
    locationId: string;
    country: string;
    state: string;
    city: string;
    isActive: boolean;
}

interface Warehouse {
    _id: string;
    code: string;
    name: string;
    type: string;
    address: string;
    locationId: string;
    status: string;
    capacity?: number;
    currentUtilization?: number;
    manager?: string;
    contact?: string;
}

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        fetchUserRole();
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = locations;

        if (searchQuery) {
            filtered = filtered.filter(
                (loc) =>
                    loc.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    loc.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    loc.city?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredLocations(filtered);
    }, [searchQuery, locations]);

    async function fetchUserRole() {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUserRole(data.user.role);
            }
        } catch (error) {
            console.error("Failed to fetch user role:", error);
        }
    }

    async function fetchData() {
        setIsLoading(true);
        try {
            const [locationsRes, warehousesRes] = await Promise.all([
                fetch("/api/locations"),
                fetch("/api/warehouses")
            ]);

            if (locationsRes.ok) {
                const data = await locationsRes.json();
                setLocations(data);
                setFilteredLocations(data);
            }

            if (warehousesRes.ok) {
                const data = await warehousesRes.json();
                setWarehouses(data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    }

    function getWarehousesByLocation(locationId: string) {
        return warehouses.filter(wh => wh.locationId === locationId);
    }

    async function deleteLocation(id: string) {
        if (!confirm("Are you sure you want to delete this location?")) return;

        try {
            const res = await fetch(`/api/locations/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setLocations(locations.filter((loc) => loc._id !== id));
            } else {
                const err = await res.json();
                alert(err.message || "Failed to delete location");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete location");
        }
    }

    if (isLoading) return <div>Loading locations and warehouses...</div>;

    // Check if user is manager
    const isManager = userRole === "manager";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Locations & Warehouses</h1>
                    <p className="text-muted-foreground">
                        {isManager 
                            ? "Manage location hierarchy and warehouse assignments"
                            : "View locations and their warehouses"}
                    </p>
                </div>
                {isManager && (
                    <Link href="/locations/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Location
                        </Button>
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search by country, state, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filteredLocations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No locations found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery ? "Try a different search term" : "Create your first location to get started"}
                        </p>
                        {isManager && !searchQuery && (
                            <Link href="/locations/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Location
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    filteredLocations.map(location => {
                        const locationWarehouses = getWarehousesByLocation(location._id);
                        const isExpanded = expandedLocations.has(location._id);
                        
                        return (
                            <div key={location._id} className="bg-white rounded-lg border">
                                <div
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                        const newExpanded = new Set(expandedLocations);
                                        if (newExpanded.has(location._id)) {
                                            newExpanded.delete(location._id);
                                        } else {
                                            newExpanded.add(location._id);
                                        }
                                        setExpandedLocations(newExpanded);
                                    }}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {locationWarehouses.length > 0 && (
                                            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        )}
                                        {locationWarehouses.length === 0 && <div className="w-4" />}
                                        
                                        <MapPin className="h-5 w-5 text-primary" />
                                        
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-gray-500">{location.locationId || location._id}</span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900">
                                                {location.city}, {location.state}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {locationWarehouses.length > 0 && (
                                            <Badge className="bg-blue-100 text-blue-700">
                                                {locationWarehouses.length} warehouse{locationWarehouses.length !== 1 ? 's' : ''}
                                            </Badge>
                                        )}
                                        {isManager && (
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Link href={`/locations/${location._id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteLocation(location._id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {isExpanded && locationWarehouses.length > 0 && (
                                    <div className="border-t p-4 bg-gray-50 space-y-2">
                                        {locationWarehouses.map(warehouse => (
                                            <div key={warehouse._id} className="p-3 bg-white rounded-lg border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Chip variant={
                                                            warehouse.status === 'active' 
                                                                ? 'success' 
                                                                : warehouse.status === 'inactive'
                                                                ? 'default'
                                                                : warehouse.status === 'maintenance'
                                                                ? 'warning'
                                                                : 'error'
                                                        }>
                                                            {warehouse.status === 'active' ? 'Active' : 
                                                             warehouse.status === 'inactive' ? 'Inactive' : 
                                                             warehouse.status === 'maintenance' ? 'Maintenance' : 
                                                             warehouse.status || 'Unknown'}
                                                        </Chip>
                                                        <Building2 className="h-4 w-4 text-blue-600" />
                                                        <span className="font-mono text-xs text-gray-500">{warehouse.code}</span>
                                                        <span className="font-medium text-gray-900">{warehouse.name}</span>
                                                    </div>
                                                    {warehouse.type && (
                                                        <Chip variant="info">
                                                            {warehouse.type}
                                                        </Chip>
                                                    )}
                                                </div>
                                                {warehouse.address && (
                                                    <p className="text-sm text-gray-600 mt-1 ml-6">{warehouse.address}</p>
                                                )}
                                                {(warehouse.manager || warehouse.capacity) && (
                                                    <div className="flex items-center gap-4 mt-2 ml-6 text-xs text-gray-500">
                                                        {warehouse.manager && <span>Manager: {warehouse.manager}</span>}
                                                        {warehouse.capacity && (
                                                            <span>
                                                                Capacity: {warehouse.currentUtilization?.toLocaleString() || 0} / {warehouse.capacity.toLocaleString()} sq ft
                                                                {warehouse.capacity && warehouse.currentUtilization && 
                                                                    ` (${Math.round((warehouse.currentUtilization / warehouse.capacity) * 100)}%)`
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
