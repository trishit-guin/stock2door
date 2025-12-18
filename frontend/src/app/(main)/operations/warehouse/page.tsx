"use client";

import { Button } from "@/components/ui/button";
import { Plus, Warehouse, Edit } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WarehousePage() {
    const router = useRouter();
    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Check authorization
                const authRes = await fetch("/api/auth/me");
                if (authRes.ok) {
                    const authData = await authRes.json();
                    if (authData.user.role !== "manager") {
                        router.push("/dashboard");
                        return;
                    }
                    setIsAuthorized(true);
                } else {
                    router.push("/login");
                    return;
                }

                // Fetch warehouses
                const res = await fetch("/api/warehouses");
                if (res.ok) {
                    const data = await res.json();
                    setLocations(data);
                }
            } catch (error) {
                console.error("Failed to fetch warehouses", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [router]);

    if (isLoading) return <div>Loading warehouses...</div>;
    
    if (!isAuthorized) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Warehouse & Locations</h1>
                    <p className="text-muted-foreground">Manage warehouse locations and storage areas</p>
                </div>
                <Link href="/operations/warehouse/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Location
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Warehouse className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Locations</p>
                        <h3 className="text-2xl font-bold">{locations.length}</h3>
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Warehouse ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.map((loc) => (
                            <TableRow key={loc._id}>
                                <TableCell className="font-mono text-sm">{loc.warehouseId || loc._id}</TableCell>
                                <TableCell className="font-medium">{loc.name}</TableCell>
                                <TableCell className="capitalize">{loc.type}</TableCell>
                                <TableCell>{loc.address || "-"}</TableCell>
                                <TableCell>
                                    <Link href={`/operations/warehouse/${loc._id}/edit`}>
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                        {locations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No locations found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
