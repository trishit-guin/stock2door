"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";

export function DeliveryForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [lines, setLines] = useState([{ productId: "", quantity: 1 }]);
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState("");
    const [warehouse, setWarehouse] = useState("");

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
                    if (warehousesRes.data.length > 0) {
                        setWarehouse(warehousesRes.data[0]._id);
                    }
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
            type: "delivery",
            date: date,
            partnerName: customer,
            sourceLocation: warehouse,
            items: lines.map(l => ({
                productId: l.productId,
                quantity: Number(l.quantity)
            }))
        };

        try {
            await api.axiosInstance.post('/movements', payload);
            router.push("/operations/deliveries");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create delivery");
        } finally {
            setIsLoading(false);
        }

            if (res.ok) {
                router.push("/operations/deliveries");
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to create delivery");
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
                    <Label htmlFor="customer">Customer Name</Label>
                    <Input
                        id="customer"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        placeholder="Enter customer name"
                        required
                    />
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
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="warehouse">Source Warehouse</Label>
                    <Select value={warehouse} onValueChange={setWarehouse}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select warehouse" />
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

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Delivery"}
                </Button>
            </div>
        </form>
    );
}
