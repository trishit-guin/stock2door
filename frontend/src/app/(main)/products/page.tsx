"use client";

import { ProductList } from "@/components/Products/ProductList";
import { Button } from "@/components/ui/button";
import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { useUserRole } from "@/hooks/useUserRole";

export default function ProductsPage() {
    const { userRole, isAdmin, isReadOnly, isLoading: roleLoading } = useUserRole();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.axiosInstance.get('/api/v1/products');
                if (response.data) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (isLoading || roleLoading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    const canManageProducts = userRole === "inventory_manager" && !isReadOnly;

    const exportToCSV = () => {
        if (products.length === 0) {
            alert("No products to export");
            return;
        }

        const headers = ["Name", "SKU", "Category", "Price", "Stock", "Min Stock", "Location"];
        const rows = products.map(p => [
            p.name,
            p.sku,
            p.category || "",
            p.price || 0,
            p.stock || 0,
            p.minStock || 0,
            p.location?.name || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split("\n").filter(line => line.trim());
                const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
                
                const productsToImport = lines.slice(1).map(line => {
                    const values = line.split(",").map(v => v.trim().replace(/"/g, ""));
                    return {
                        name: values[0],
                        sku: values[1],
                        category: values[2] || undefined,
                        price: parseFloat(values[3]) || 0,
                        stock: parseInt(values[4]) || 0,
                        minStock: parseInt(values[5]) || 0,
                    };
                });

                // Import products one by one
                let successCount = 0;
                for (const product of productsToImport) {
                    try {
                        await api.axiosInstance.post('/api/v1/products', product);
                        successCount++;
                    } catch (err) {
                        console.error("Failed to import:", product.name);
                    }
                }

                alert(`Successfully imported ${successCount} of ${productsToImport.length} products`);
                window.location.reload();
            } catch (error) {
                alert("Failed to parse CSV file");
                console.error(error);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        {canManageProducts
                            ? "Manage your product catalog and stock levels." 
                            : "View product catalog and stock information."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    {canManageProducts && (
                        <>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Import CSV
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".csv"
                                className="hidden"
                                onChange={handleImportCSV}
                            />
                            <Link href="/products/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Product
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <ProductList />
        </div>
    );
}
