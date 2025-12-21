"use client";

import { WarehouseForm } from "@/components/Operations/WarehouseForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";

export default function CreateWarehousePage() {
    const router = useRouter();
    const { userRole, isReadOnly, isLoading } = useUserRole();

    useEffect(() => {
        if (!isLoading) {
            // Allow both admin and inventory_manager
            if (userRole !== "inventory_manager" && userRole !== "admin") {
                router.push("/operations/warehouse");
            }
        }
    }, [userRole, isReadOnly, isLoading, router]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    if (userRole !== "inventory_manager" && userRole !== "admin") {
        return null;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Warehouse</h1>
                <p className="text-muted-foreground">
                    Add a new warehouse or location to your inventory network.
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <WarehouseForm />
            </div>
        </div>
    );
}
