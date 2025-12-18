"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Layout/Logo";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                // Redirect based on user role
                if (data.user?.role === "staff") {
                    router.push("/staff-dashboard");
                } else {
                    router.push("/dashboard");
                }
            } else {
                const data = await res.json();
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
            <div className="w-full max-w-md">
                {/* Back to Home Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-base font-medium text-gray-700 hover:text-[#1A73E8] mb-8 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to Home
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    {/* Logo & Title */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center mb-2">
                            <Logo size={48} showText={true} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
                        <p className="text-gray-600">Login to your Stock2Door account.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-[#1A73E8] hover:text-[#1557b0] hover:underline"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Login"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-semibold text-[#1A73E8] hover:text-[#1557b0] hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
