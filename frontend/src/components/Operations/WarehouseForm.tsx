"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Inventory {
    _id: string;
    name: string;
    email: string;
}

export function WarehouseForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryId, setInventoryId] = useState("");
    const [inventories, setInventories] = useState<Inventory[]>([]);

    useEffect(() => {
        fetchInventories();
    }, []);

    async function fetchInventories() {
        try {
            const response = await api.axiosInstance.get('/inventories');
            if (response.data) {
                const inventoriesData = response.data.data || response.data.inventories || response.data;
                setInventories(Array.isArray(inventoriesData) ? inventoriesData : []);
            }
        } catch (error) {
            console.error("Failed to fetch inventories:", error);
        }
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!inventoryId) {
            alert("Please select an inventory");
            setIsLoading(false);
            return;
        }

        const formData = new FormData(event.currentTarget);
        const payload = {
            inventoryId: inventoryId,
            warehouseCode: formData.get("warehouseCode"),
            name: formData.get("name"),
            warehouseType: formData.get("warehouseType") || "STORAGE",
            location: {
                street: formData.get("street"),
                city: formData.get("city"),
                state: formData.get("state"),
                country: formData.get("country"),
                zipCode: formData.get("zipCode")
            },
            contactEmail: formData.get("contactEmail"),
            contactPhone: formData.get("contactPhone")
        };

        try {
            await api.axiosInstance.post('/warehouses', payload);
            alert('Warehouse created successfully!');
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
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="inventory">Parent Inventory *</Label>
                    <Select value={inventoryId} onValueChange={setInventoryId} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Inventory" />
                        </SelectTrigger>
                        <SelectContent>
                            {inventories.map((inv) => (
                                <SelectItem key={inv._id} value={inv._id}>
                                    {inv.name} ({inv.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Select the inventory this warehouse belongs to</p>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="warehouseCode">Warehouse Code *</Label>
                    <Input 
                        id="warehouseCode" 
                        name="warehouseCode"
                        placeholder="e.g. WH001, CENTRAL" 
                        required 
                    />
                    <p className="text-xs text-gray-500">Unique code (uppercase)</p>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="name">Warehouse Name *</Label>
                    <Input id="name" name="name" placeholder="e.g. Central Warehouse" required />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="warehouseType">Warehouse Type</Label>
                    <Select name="warehouseType" defaultValue="storage">
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="storage">Storage</SelectItem>
                            <SelectItem value="distribution">Distribution</SelectItem>
                            <SelectItem value="cold_storage">Cold Storage</SelectItem>
                            <SelectItem value="hazmat">Hazmat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" name="contactEmail" type="email" placeholder="warehouse@example.com" />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input id="contactPhone" name="contactPhone" type="tel" placeholder="+1234567890" />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <h3 className="text-lg font-semibold">Location Details</h3>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" name="street" placeholder="123 Logistics Way" />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" placeholder="New York" required />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input id="state" name="state" placeholder="NY" required />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" name="country" placeholder="USA" required />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip/Postal Code</Label>
                    <Input id="zipCode" name="zipCode" placeholder="10001" />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Warehouse"}
                </Button>
            </div>
        </form>
    );
}
