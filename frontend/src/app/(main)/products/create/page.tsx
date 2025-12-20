"use client";

import { ProductForm } from "@/components/Products/ProductForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useUserRole } from "@/hooks/useUserRole";

export default function CreateProductPage() {
    const router = useRouter();
    const { userRole, isReadOnly, isLoading } = useUserRole();

    useEffect(() => {
        if (!isLoading) {
            if (userRole !== "inventory_manager" || isReadOnly) {
                router.push("/products");
            }
        }
    }, [userRole, isReadOnly, isLoading, router]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    if (userRole !== "inventory_manager" || isReadOnly) {
        return null;
    }
            }
        }
        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
                <p className="text-muted-foreground">
                    Add a new product to your inventory.
                </p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <ProductForm />
            </div>
        </div>
    );
}
