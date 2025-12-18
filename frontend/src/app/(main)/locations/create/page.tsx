"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateLocationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [locationId, setLocationId] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locationId,
                    country,
                    state,
                    city,
                }),
            });

            if (res.ok) {
                router.push("/locations");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to create location");
            }
        } catch (error) {
            console.error("Error creating location:", error);
            alert("Failed to create location");
        } finally {
            setIsLoading(false);
        }
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
                    <h1 className="text-3xl font-bold tracking-tight">Create Location</h1>
                    <p className="text-muted-foreground">Add a new location (Country - State - City)</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-white p-6 rounded-lg border space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="locationId">Location ID *</Label>
                        <Input
                            id="locationId"
                            value={locationId}
                            onChange={(e) => setLocationId(e.target.value)}
                            placeholder="e.g., LOC-001, NYC-001"
                            required
                        />
                        <p className="text-xs text-gray-500">Unique identifier for this location</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="country">Country *</Label>
                            <Input
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="e.g., United States"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">State/Province *</Label>
                            <Input
                                id="state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="e.g., California"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g., Los Angeles"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Location"}
                    </Button>
                    <Link href="/locations">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
