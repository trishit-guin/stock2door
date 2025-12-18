"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProductForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name"),
            sku: formData.get("sku"),
            category: formData.get("category"), // Note: Select component handling might need adjustment if not using native select
            uom: formData.get("uom"),
            minStock: Number(formData.get("minStock")),
            // For now, we aren't setting initial stock/location here as per schema change
            // stockLevels would be handled via Receipts/Adjustments
        };

        // Manual handling for Select components if they don't inject hidden inputs
        // Assuming standard HTML form behavior or Shadcn Select needs controlled state
        // For simplicity in this step, let's assume we need to manage state for Selects or use a library like react-hook-form
        // But to keep it simple with current code:
        // We need to capture Select values. Let's add state for them.
    }

    // Refactoring to use state for Selects to ensure values are captured
    const [category, setCategory] = useState("");
    const [uom, setUom] = useState("");

    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const payload = {
            name: formData.get("name"),
            sku: formData.get("sku"),
            category: category,
            uom: uom,
            minStock: Number(formData.get("minStock")),
            price: Number(formData.get("price")) || 0,
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/products");
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to create product");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Steel Rod 10mm" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sku">SKU / Code</Label>
                    <Input id="sku" name="sku" placeholder="e.g. SR-10" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="raw">Raw Material</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="consumable">Consumable</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="uom">Unit of Measure</Label>
                    <Select value={uom} onValueChange={setUom}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select UoM" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="pcs">pcs</SelectItem>
                            <SelectItem value="l">l</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minStock">Minimum Stock</Label>
                    <Input id="minStock" name="minStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Unit Price</Label>
                    <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" />
                </div>
                {/* Location removed as it's now part of stockLevels managed via operations */}
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Create Product"}
                </Button>
            </div>
        </form>
    );
}
