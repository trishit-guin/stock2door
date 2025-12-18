"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token");
        }
    }, [token]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
            <div className="w-full max-w-md">
                {/* Back to Login Link */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-base font-medium text-gray-700 hover:text-[#1A73E8] mb-8 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to Login
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/stock2door-logo.svg"
                            alt="Stock2Door"
                            width={180}
                            height={45}
                            className="object-contain"
                            priority
                        />
                    </div>
                    
                    {/* Icon & Title */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#1A73E8]">
                                <LockClosedIcon className="h-8 w-8" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                        <p className="text-gray-600">
                            Enter your new password below.
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-green-700 text-sm">{message}</p>
                            <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    {!message && !error.includes("Invalid or missing") && (
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    New Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                                disabled={isLoading || !token}
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link href="/login" className="font-semibold text-[#1A73E8] hover:text-[#1557b0] hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
