"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        uom: "pcs",
        minStock: 0,
    });

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    async function fetchProduct() {
        try {
            const res = await fetch(`/api/products/${productId}`);
            if (res.ok) {
                const product = await res.json();
                setFormData({
                    name: product.name,
                    sku: product.sku,
                    category: product.category || "",
                    uom: product.uom,
                    minStock: product.minStock,
                });
            } else {
                alert("Product not found");
                router.push("/products");
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
            alert("Failed to load product");
        } finally {
            setIsFetching(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/products");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/products");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    }

    if (isFetching) {
        return <div>Loading product...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/products">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-muted-foreground">Update product information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-white p-6 rounded-lg border space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Laptop Dell XPS 13"
                            required
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU *</Label>
                            <Input
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="e.g., DELL-XPS13-001"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="e.g., Electronics"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="uom">Unit of Measure *</Label>
                            <Input
                                id="uom"
                                value={formData.uom}
                                onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                                placeholder="e.g., pcs, kg, liters"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minStock">Minimum Stock Level *</Label>
                            <Input
                                id="minStock"
                                type="number"
                                min="0"
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Product"}
                    </Button>
                    <Link href="/products">
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
                        Delete Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
