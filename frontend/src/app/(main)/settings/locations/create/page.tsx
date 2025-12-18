"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateLocationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [locationId, setLocationId] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
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
                router.push("/settings/locations");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to create location");
            }
        } catch (error) {
            console.error("Error creating location:", error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/settings/locations">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Location</h1>
                    <p className="text-muted-foreground">Add a new location to the hierarchy</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
                <form onSubmit={onSubmit} className="space-y-6">
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

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Location"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
