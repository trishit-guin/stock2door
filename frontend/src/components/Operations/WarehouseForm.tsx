"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Location {
    _id: string;
    country: string;
    state: string;
    city: string;
}

export function WarehouseForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [warehouseId, setWarehouseId] = useState("");
    const [type, setType] = useState("internal");
    const [locationId, setLocationId] = useState("");
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        fetchLocations();
    }, []);

    async function fetchLocations() {
        try {
            const response = await api.axiosInstance.get('/api/v1/warehouses');
            if (response.data) {
                setLocations(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch locations:", error);
        }
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!locationId) {
            alert("Please select a location");
            setIsLoading(false);
            return;
        }

        const formData = new FormData(event.currentTarget);
        const payload = {
            warehouseId: warehouseId,
            name: formData.get("name"),
            type: type,
            address: formData.get("address"),
            locationId: locationId,
        };

        try {
            await api.axiosInstance.post('/api/v1/warehouses', payload);
            router.push("/operations/warehouse");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create warehouse");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="warehouseId">Warehouse ID</Label>
                    <Input 
                        id="warehouseId" 
                        value={warehouseId}
                        onChange={(e) => setWarehouseId(e.target.value)}
                        placeholder="e.g. WH-001, CENTRAL-001" 
                        required 
                    />
                    <p className="text-xs text-gray-500">Unique identifier for this warehouse</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Warehouse Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Central Warehouse" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="supplier">Supplier</SelectItem>
                            <SelectItem value="transit">Transit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location *</Label>
                    <Select value={locationId} onValueChange={setLocationId} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((loc) => (
                                <SelectItem key={loc._id} value={loc._id}>
                                    {loc.city}, {loc.state}, {loc.country}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="e.g. 123 Logistics Way" />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Create Warehouse"}
                </Button>
            </div>
        </form>
    );
}
