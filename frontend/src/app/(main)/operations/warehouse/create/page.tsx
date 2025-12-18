"use client";

import { WarehouseForm } from "@/components/Operations/WarehouseForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateWarehousePage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.user.role === "manager") {
                        setIsAuthorized(true);
                    } else {
                        router.push("/operations/warehouse");
                    }
                } else {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    if (!isAuthorized) {
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
