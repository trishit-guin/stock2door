"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

export function AdjustmentForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [lines, setLines] = useState([{ productId: "", countedQuantity: 0 }]);
    const [warehouse, setWarehouse] = useState("");
    const [date, setDate] = useState("");

    // Fetch products and warehouses on mount
    useEffect(() => {
        async function fetchData() {
            const [productsRes, warehousesRes] = await Promise.all([
                fetch("/api/products"),
                fetch("/api/warehouses")
            ]);

            if (productsRes.ok) {
                const data = await productsRes.json();
                setProducts(data);
            }

            if (warehousesRes.ok) {
                const data = await warehousesRes.json();
                setWarehouses(data);
                if (data.length > 0) {
                    setWarehouse(data[0]._id);
                }
            }
        }
        fetchData();
    }, []);

    const addLine = () => {
        setLines([...lines, { productId: "", countedQuantity: 0 }]);
    };

    const removeLine = (index: number) => {
        setLines(lines.filter((_, i) => i !== index));
    };

    const updateLine = (index: number, field: "productId" | "countedQuantity", value: string | number) => {
        const newLines = [...lines];
        // @ts-ignore
        newLines[index][field] = value;
        setLines(newLines);
    };

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const payload = {
            type: "adjustment",
            date: date,
            destinationLocation: warehouse,
            items: lines.map(l => ({
                productId: l.productId,
                quantity: Number(l.countedQuantity)
            }))
        };

        try {
            const res = await fetch("/api/moves", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/operations/adjustments");
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to create adjustment");
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
                    <Label htmlFor="location">Location</Label>
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
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
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
                                <Label>Counted Qty</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={line.countedQuantity}
                                    onChange={(e) => updateLine(index, "countedQuantity", parseInt(e.target.value))}
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
                    {isLoading ? "Applying..." : "Apply Adjustment"}
                </Button>
            </div>
        </form>
    );
}
