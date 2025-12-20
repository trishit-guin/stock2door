"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Layout/Logo";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("warehouse_staff");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const firstName = formData.get("first-name");
        const lastName = formData.get("last-name");
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const response = await api.register({
                username: username as string,
                firstName: firstName as string,
                lastName: lastName as string,
                email: email as string,
                password: password as string,
                role: role
            });

            if (response.data) {
                // Success message with styling
                console.log(
                    '%c🚀 Account Created Successfully!',
                    'color: #10b981; font-size: 16px; font-weight: bold; padding: 8px; background: #ecfdf5; border-radius: 4px;'
                );
                console.log(
                    `%c👋 Hello, ${firstName}!`,
                    'color: #3b82f6; font-size: 14px; padding: 4px;'
                );
                console.log(
                    `%c📧 Email: ${email}`,
                    'color: #6366f1; font-size: 13px; padding: 4px;'
                );
                console.log(
                    `%c🎭 Role: ${role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`,
                    'color: #8b5cf6; font-size: 14px; padding: 4px;'
                );
                console.log(
                    '%c✨ Welcome to SmartRoute!',
                    'color: #f59e0b; font-size: 14px; font-weight: bold; padding: 4px;'
                );
                
                alert("Account created successfully! Please login.");
                router.push("/login");
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
            alert(errorMessage);
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
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-600">Sign up to get started with Stock2Door.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="johndoe"
                                required
                                className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name" className="text-sm font-semibold text-gray-700">First Name</Label>
                                <Input
                                    id="first-name"
                                    name="first-name"
                                    placeholder="John"
                                    required
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name" className="text-sm font-semibold text-gray-700">Last Name</Label>
                                <Input
                                    id="last-name"
                                    name="last-name"
                                    placeholder="Doe"
                                    required
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                                />
                            </div>
                        </div>
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
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-semibold text-gray-700">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent className="z-50 bg-white border-2 border-gray-200 shadow-xl">
                                    <SelectItem value="warehouse_staff">Warehouse Staff</SelectItem>
                                    <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
                                    <SelectItem value="logistics_manager">Logistics Manager</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-[#1A73E8] hover:text-[#1557b0] hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
