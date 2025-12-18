"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditWarehousePage() {
    const router = useRouter();
    const params = useParams();
    const warehouseId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [locations, setLocations] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        warehouseId: "",
        name: "",
        type: "internal",
        address: "",
        locationId: "",
    });

    useEffect(() => {
        fetchLocations();
        fetchWarehouse();
    }, [warehouseId]);

    async function fetchLocations() {
        try {
            const res = await fetch("/api/locations");
            if (res.ok) {
                const data = await res.json();
                setLocations(data);
            }
        } catch (error) {
            console.error("Failed to fetch locations", error);
        }
    }

    async function fetchWarehouse() {
        try {
            const res = await fetch(`/api/warehouses/${warehouseId}`);
            if (res.ok) {
                const warehouse = await res.json();
                setFormData({
                    warehouseId: warehouse.warehouseId,
                    name: warehouse.name,
                    type: warehouse.type,
                    address: warehouse.address || "",
                    locationId: warehouse.locationId?._id || "",
                });
            } else {
                alert("Warehouse not found");
                router.push("/operations/warehouse");
            }
        } catch (error) {
            console.error("Failed to fetch warehouse", error);
            alert("Failed to load warehouse");
        } finally {
            setIsFetching(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/warehouses/${warehouseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: formData.type,
                    address: formData.address,
                    locationId: formData.locationId,
                }),
            });

            if (res.ok) {
                router.push("/operations/warehouse");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to update warehouse");
            }
        } catch (error) {
            console.error("Error updating warehouse:", error);
            alert("Failed to update warehouse");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this warehouse? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/warehouses/${warehouseId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/operations/warehouse");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to delete warehouse");
            }
        } catch (error) {
            console.error("Error deleting warehouse:", error);
            alert("Failed to delete warehouse");
        }
    }

    if (isFetching) {
        return <div>Loading warehouse...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/operations/warehouse">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Warehouse</h1>
                    <p className="text-muted-foreground">Update warehouse information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-white p-6 rounded-lg border space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="warehouseId">Warehouse ID *</Label>
                        <Input
                            id="warehouseId"
                            value={formData.warehouseId}
                            disabled
                            className="bg-gray-50 cursor-not-allowed font-mono"
                        />
                        <p className="text-xs text-gray-500">Warehouse ID cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Warehouse Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            disabled
                            className="bg-gray-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500">Warehouse name cannot be changed</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="type">Warehouse Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internal">Internal</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="supplier">Supplier</SelectItem>
                                    <SelectItem value="transit">Transit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Select
                                value={formData.locationId}
                                onValueChange={(value) => setFormData({ ...formData, locationId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter warehouse address"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Warehouse"}
                    </Button>
                    <Link href="/operations/warehouse">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        className="ml-auto"
                    >
                        Delete Warehouse
                    </Button>
                </div>
            </form>
        </div>
    );
}
