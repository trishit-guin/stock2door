"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Search, Edit } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useUserRole } from "@/hooks/useUserRole";

interface Product {
    _id: string;
    name: string;
    sku: string;
    category: string;
    unit: string;
    totalStock: number;
    reorderLevel: number;
    lowStock: boolean;
    price: number;
}

export function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const { userRole, isReadOnly } = useUserRole();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.axiosInstance.get('/api/v1/products');
                if (response.data) {
                    setProducts(response.data);
                    setFilteredProducts(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = products;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        // Stock status filter
        if (stockFilter !== "all") {
            filtered = filtered.filter((p) => {
                if (stockFilter === "low") return p.lowStock || p.totalStock <= p.reorderLevel;
                if (stockFilter === "in-stock") return !p.lowStock && p.totalStock > p.reorderLevel;
                if (stockFilter === "out") return p.totalStock === 0;
                return true;
            });
        }

        setFilteredProducts(filtered);
    }, [searchQuery, categoryFilter, stockFilter, products]);

    const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

    if (isLoading) {
        return <div>Loading products...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg border">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search by name or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={stockFilter} onValueChange={setStockFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Stock Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stock</SelectItem>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low">Low Stock</SelectItem>
                            <SelectItem value="out">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total Stock</TableHead>
                            <TableHead>Status</TableHead>
                            {userRole === "manager" && <TableHead>Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={userRole === "manager" ? 8 : 7} className="text-center h-24">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.unit}</TableCell>
                                    <TableCell>₹{product.price?.toFixed(2) || "0.00"}</TableCell>
                                    <TableCell>{product.totalStock}</TableCell>
                                    <TableCell>
                                        {product.totalStock === 0 ? (
                                            <Badge variant="destructive">Out of Stock</Badge>
                                        ) : product.lowStock || product.totalStock <= product.reorderLevel ? (
                                            <Badge className="bg-orange-500 hover:bg-orange-600">Low Stock</Badge>
                                        ) : (
                                            <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>
                                        )}
                                    </TableCell>
                                    {userRole === "manager" && (
                                        <TableCell>
                                            <Link href={`/products/${product._id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
