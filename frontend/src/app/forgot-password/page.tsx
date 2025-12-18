"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    async function handleSendOTP(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setOtpSent(true);
                setMessage(data.message);
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Password reset successful! Redirecting to login...");
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
                                {otpSent ? <LockClosedIcon className="h-8 w-8" /> : <EnvelopeIcon className="h-8 w-8" />}
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {otpSent ? "Reset Password" : "Forgot Password?"}
                        </h1>
                        <p className="text-gray-600">
                            {otpSent
                                ? "Enter the verification code sent to your email and your new password."
                                : "Enter your email address and we'll send you a verification code."}
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-green-700 text-sm">{message}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    {!otpSent ? (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Verification Code"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-sm font-semibold text-gray-700">
                                    Verification Code (OTP)
                                </Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#1A73E8]"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setOtpSent(false);
                                        setOtp("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        setError("");
                                        setMessage("");
                                    }}
                                    className="flex-1 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 rounded-xl bg-[#1A73E8] hover:bg-[#1557b0] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSendOTP(e as any);
                                }}
                                disabled={isLoading}
                                className="w-full text-sm text-[#1A73E8] hover:text-[#1557b0] hover:underline"
                            >
                                Resend Code
                            </button>
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
