"use client";

import { Button } from "@/components/ui/button";
import { Plus, MapPin, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";

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
    warehouseId: string;
    name: string;
    type: string;
    address: string;
    locationId: string;
    status: string;
    code?: string;
    capacity?: number;
    currentUtilization?: number;
    manager?: string;
    contact?: string;
}

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [locationsRes, warehousesRes] = await Promise.all([
                fetch("/api/locations"),
                fetch("/api/warehouses")
            ]);

            if (locationsRes.ok) {
                const data = await locationsRes.json();
                setLocations(data);
            }

            if (warehousesRes.ok) {
                const data = await warehousesRes.json();
                setWarehouses(data);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    function getWarehousesByLocation(locationId: string) {
        return warehouses.filter(wh => wh.locationId === locationId);
    }

    if (isLoading) {
        return <div>Loading locations...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Locations & Warehouses</h1>
                    <p className="text-muted-foreground">Manage location hierarchy and warehouse assignments</p>
                </div>
                <Link href="/settings/locations/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Location
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {locations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No locations yet</h3>
                        <p className="text-gray-500 mb-4">Create your first location to get started</p>
                        <Link href="/settings/locations/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Location
                            </Button>
                        </Link>
                    </div>
                ) : (
                    locations.map(location => {
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
                                                {location.city}, {location.state}, {location.country}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {locationWarehouses.length > 0 && (
                                            <Badge className="bg-blue-100 text-blue-700">
                                                {locationWarehouses.length} warehouse{locationWarehouses.length !== 1 ? 's' : ''}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                {isExpanded && locationWarehouses.length > 0 && (
                                    <div className="border-t p-4 bg-gray-50 space-y-2">
                                        {locationWarehouses.map(warehouse => (
                                            <div key={warehouse._id} className="p-3 bg-white rounded-lg border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-blue-600" />
                                                        <span className="font-mono text-xs text-gray-500">{warehouse.code || warehouse.warehouseId || warehouse._id}</span>
                                                        <span className="font-medium text-gray-900">{warehouse.name}</span>
                                                        {warehouse.type && (
                                                            <Chip variant="info">
                                                                {warehouse.type}
                                                            </Chip>
                                                        )}
                                                    </div>
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
