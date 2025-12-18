"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditLocationPage() {
    const router = useRouter();
    const params = useParams();
    const locationId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        locationId: "",
        country: "",
        state: "",
        city: "",
    });

    useEffect(() => {
        fetchLocation();
    }, [locationId]);

    async function fetchLocation() {
        try {
            const res = await fetch(`/api/locations/${locationId}`);
            if (res.ok) {
                const location = await res.json();
                setFormData({
                    locationId: location.locationId,
                    country: location.country,
                    state: location.state,
                    city: location.city,
                });
            } else {
                alert("Location not found");
                router.push("/locations");
            }
        } catch (error) {
            console.error("Failed to fetch location", error);
            alert("Failed to load location");
        } finally {
            setIsFetching(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/locations/${locationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    state: formData.state,
                    city: formData.city,
                }),
            });

            if (res.ok) {
                router.push("/locations");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to update location");
            }
        } catch (error) {
            console.error("Error updating location:", error);
            alert("Failed to update location");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/locations/${locationId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/locations");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to delete location");
            }
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("Failed to delete location");
        }
    }

    if (isFetching) {
        return <div>Loading location...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/locations">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Location</h1>
                    <p className="text-muted-foreground">Update location information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-white p-6 rounded-lg border space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="locationId">Location ID *</Label>
                        <Input
                            id="locationId"
                            value={formData.locationId}
                            disabled
                            className="bg-gray-50 cursor-not-allowed font-mono"
                        />
                        <p className="text-xs text-gray-500">Location ID cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                            id="country"
                            value={formData.country}
                            disabled
                            className="bg-gray-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500">Country cannot be changed</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="state">State/Province *</Label>
                            <Input
                                id="state"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                placeholder="e.g., California, Maharashtra"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="e.g., Los Angeles, Mumbai"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Location"}
                    </Button>
                    <Link href="/locations">
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
                        Delete Location
                    </Button>
                </div>
            </form>
        </div>
    );
}
