"use client";

import { ProductForm } from "@/components/Products/ProductForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
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
                        router.push("/products");
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
