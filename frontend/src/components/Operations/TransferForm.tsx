"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MapPinIcon } from "lucide-react";
import { RouteOptimizer } from "@/components/RouteOptimizer";
import api from "@/lib/api";

export function TransferForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [lines, setLines] = useState([{ productId: "", quantity: 1 }]);
    const [sourceWarehouse, setSourceWarehouse] = useState("");
    const [destinationWarehouse, setDestinationWarehouse] = useState("");
    const [date, setDate] = useState("");
    const [showRouteOptimizer, setShowRouteOptimizer] = useState(false);
    const [optimizedRoute, setOptimizedRoute] = useState<any>(null);

    // Fetch products and warehouses on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const [productsRes, warehousesRes] = await Promise.all([
                    api.axiosInstance.get('/products'),
                    api.axiosInstance.get('/warehouses')
                ]);

                if (productsRes.data) {
                    setProducts(productsRes.data);
                }

                if (warehousesRes.data) {
                    setWarehouses(warehousesRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        }
        fetchData();
    }, []);

    const addLine = () => {
        setLines([...lines, { productId: "", quantity: 1 }]);
    };

    const removeLine = (index: number) => {
        setLines(lines.filter((_, i) => i !== index));
    };

    const updateLine = (index: number, field: "productId" | "quantity", value: string | number) => {
        const newLines = [...lines];
        // @ts-ignore
        newLines[index][field] = value;
        setLines(newLines);
    };

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const payload = {
            type: "internal",
            date: date,
            sourceLocation: sourceWarehouse,
            destinationLocation: destinationWarehouse,
            items: lines.map(l => ({
                productId: l.productId,
                quantity: Number(l.quantity)
            }))
        };

        try {
            await api.axiosInstance.post('/movements', payload);
            router.push("/operations/transfers");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create transfer");
        } finally {
            setIsLoading(false);
        }

            if (res.ok) {
                router.push("/operations/transfers");
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to create transfer");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="source">Source Location</Label>
                    <Select value={sourceWarehouse} onValueChange={setSourceWarehouse}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select source warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map((wh) => (
                                <SelectItem key={wh._id} value={wh._id}>
                                    {wh.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="destination">Destination Location</Label>
                    <Select value={destinationWarehouse} onValueChange={setDestinationWarehouse}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select destination warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map((wh) => (
                                <SelectItem key={wh._id} value={wh._id}>
                                    {wh.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Scheduled Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Products</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addLine}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Line
                    </Button>
                </div>

                <div className="space-y-3">
                    {lines.map((line, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1 space-y-2">
                                <Label>Product</Label>
                                <Select
                                    value={line.productId}
                                    onValueChange={(value) => updateLine(index, "productId", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p._id} value={p._id}>
                                                {p.name} ({p.sku})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-32 space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={line.quantity}
                                    onChange={(e) => updateLine(index, "quantity", parseInt(e.target.value))}
                                />
                            </div>
                            <div className="pt-8">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeLine(index)}
                                    disabled={lines.length === 1}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Route Optimization Section */}
            {sourceWarehouse && destinationWarehouse && (
                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Route Optimization</h3>
                            <p className="text-sm text-gray-500">
                                Optimize your transfer route for cost, time, and emissions
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowRouteOptimizer(!showRouteOptimizer)}
                        >
                            <MapPinIcon className="mr-2 h-4 w-4" />
                            {showRouteOptimizer ? 'Hide' : 'Show'} Route Optimizer
                        </Button>
                    </div>

                    {showRouteOptimizer && (
                        <div className="bg-gray-50 rounded-lg p-6 border">
                            <RouteOptimizer
                                sourceWarehouseId={sourceWarehouse}
                                destinationWarehouseId={destinationWarehouse}
                                productId={lines[0]?.productId}
                                quantity={lines.reduce((sum, line) => sum + Number(line.quantity), 0)}
                                onRouteSelected={(route) => {
                                    setOptimizedRoute(route)
                                    console.log('Selected route:', route)
                                }}
                            />
                        </div>
                    )}

                    {optimizedRoute && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-green-800">
                                ✓ Route optimized! Estimated cost: ₹{optimizedRoute.cost?.value?.toFixed(2)} | 
                                CO₂: {optimizedRoute.emissions?.value?.toFixed(2)} kg | 
                                Duration: {optimizedRoute.duration?.adjusted?.toFixed(1)} hrs
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Transfer"}
                </Button>
            </div>
        </form>
    );
}
