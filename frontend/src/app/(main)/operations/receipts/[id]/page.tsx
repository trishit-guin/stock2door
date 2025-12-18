"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, MapPin, Calendar, User, Trash2, Check } from "lucide-react";
import Link from "next/link";

interface ReceiptDetail {
    _id: string;
    type: string;
    date: string;
    status: string;
    partnerName?: string;
    sourceLocation?: { _id: string; name: string };
    destinationLocation?: { _id: string; name: string };
    items: Array<{
        _id: string;
        productId: { _id: string; name: string; uom?: string };
        quantity: number;
    }>;
    createdBy?: { firstName: string; lastName: string };
    createdAt: string;
}

export default function ReceiptDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    useEffect(() => {
        if (!resolvedParams) return;

        async function fetchReceipt() {
            try {
                const res = await fetch(`/api/moves/${resolvedParams.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setReceipt(data);
                } else {
                    alert("Receipt not found");
                    router.push("/operations/receipts");
                }
            } catch (error) {
                console.error("Failed to fetch receipt", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchReceipt();
    }, [resolvedParams, router]);

    async function handleValidate() {
        if (!resolvedParams || !receipt) return;

        try {
            const res = await fetch(`/api/moves/${resolvedParams.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "done" }),
            });

            if (res.ok) {
                const updated = await res.json();
                setReceipt(updated);
                alert("Receipt validated successfully!");
            } else {
                const err = await res.json();
                alert(err.message || "Failed to validate receipt");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    }

    async function handleDelete() {
        if (!resolvedParams || !confirm("Are you sure you want to delete this receipt?")) return;

        try {
            const res = await fetch(`/api/moves/${resolvedParams.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Receipt deleted successfully");
                router.push("/operations/receipts");
            } else {
                const err = await res.json();
                alert(err.message || "Failed to delete receipt");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </div>
        );
    }

    if (!receipt) {
        return <div>Receipt not found</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "done": return "default";
            case "draft": return "secondary";
            case "waiting": return "outline";
            default: return "outline";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/operations/receipts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Receipt RCP-{receipt._id.slice(-6)}
                        </h1>
                        <p className="text-muted-foreground">
                            Created on {new Date(receipt.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {receipt.status === "draft" && (
                        <Button onClick={handleValidate}>
                            <Check className="mr-2 h-4 w-4" />
                            Validate
                        </Button>
                    )}
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Details Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Receipt Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={getStatusColor(receipt.status)} className="mt-1">
                                {receipt.status.toUpperCase()}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Vendor</p>
                            <p className="font-medium">{receipt.partnerName || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Receipt Date</p>
                            <p className="font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(receipt.date).toLocaleDateString()}
                            </p>
                        </div>
                        {receipt.createdBy && (
                            <div>
                                <p className="text-sm text-muted-foreground">Created By</p>
                                <p className="font-medium flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {receipt.createdBy.firstName} {receipt.createdBy.lastName}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Location Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Destination Warehouse</p>
                            <p className="font-medium">{receipt.destinationLocation?.name || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Line Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>UOM</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receipt.items.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">
                                        {item.productId?.name || "Unknown Product"}
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.productId?.uom || "Units"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
