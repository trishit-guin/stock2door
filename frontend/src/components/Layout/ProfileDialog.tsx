"use client";

import { X, User, Mail, Briefcase, Calendar, Key, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface ProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export function ProfileDialog({ isOpen, onClose }: ProfileDialogProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Password change state
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [isChangingPwd, setIsChangingPwd] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen]);

    async function fetchProfile() {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/user/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
            } else {
                setError("Failed to load profile");
            }
        } catch (err) {
            setError("An error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave() {
        if (!profile) return;

        setIsSaving(true);
        setError(null);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email }),
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setIsEditing(false);
            } else {
                const data = await res.json();
                setError(data.message || "Failed to update profile");
            }
        } catch (err) {
            setError("An error occurred");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    }

    function handleCancel() {
        if (profile) {
            setFirstName(profile.firstName);
            setLastName(profile.lastName);
            setEmail(profile.email);
        }
        setIsEditing(false);
        setError(null);
    }

    async function handleSendOTP() {
        setIsSendingOTP(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok) {
                setOtpSent(true);
                // Show demo OTP in success message for easy testing
                const otpMessage = data.demoOTP 
                    ? `OTP sent to ${data.email}. Demo OTP: ${data.demoOTP}` 
                    : `OTP sent to ${data.email}`;
                setSuccess(otpMessage);
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setError("An error occurred while sending OTP");
            console.error(err);
        } finally {
            setIsSendingOTP(false);
        }
    }

    async function handleChangePassword() {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsChangingPwd(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Password changed successfully!");
                // Reset form
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setOtpSent(false);
                setIsChangingPassword(false);
            } else {
                setError(data.message || "Failed to change password");
            }
        } catch (err) {
            setError("An error occurred while changing password");
            console.error(err);
        } finally {
            setIsChangingPwd(false);
        }
    }

    function handleCancelPasswordChange() {
        setIsChangingPassword(false);
        setOtpSent(false);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setError(null);
        setSuccess(null);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-bold text-slate-900 font-display">Profile Details</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 rounded-full hover:bg-slate-100">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {/* Success State */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 font-medium">{success}</p>
                    </div>
                )}

                {/* Profile Content */}
                {!isLoading && profile && (
                    <>
                        {/* Change Password View */}
                        {isChangingPassword ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Lock className="h-6 w-6 text-primary" />
                                    <h3 className="text-2xl font-bold text-slate-900">Change Password</h3>
                                </div>

                                {!otpSent ? (
                                    <div className="space-y-4">
                                        <p className="text-muted-foreground">
                                            We'll send a verification code to your email address to confirm your identity.
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleSendOTP}
                                                disabled={isSendingOTP}
                                                className="min-w-[140px]"
                                            >
                                                {isSendingOTP ? "Sending..." : "Send OTP"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleCancelPasswordChange}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp">Verification Code (OTP)</Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter 6-digit code"
                                                maxLength={6}
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Minimum 6 characters"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter new password"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                onClick={handleChangePassword}
                                                disabled={isChangingPwd || !otp || !newPassword || !confirmPassword}
                                                className="min-w-[140px]"
                                            >
                                                {isChangingPwd ? "Changing..." : "Change Password"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleCancelPasswordChange}
                                                disabled={isChangingPwd}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        <Button
                                            variant="link"
                                            onClick={handleSendOTP}
                                            disabled={isSendingOTP}
                                            className="text-sm"
                                        >
                                            Resend OTP
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-8 ring-primary/5">
                                        <User className="h-12 w-12" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-bold text-slate-900 font-display">
                                            {profile.firstName} {profile.lastName}
                                        </h3>
                                        <p className="text-lg text-muted-foreground font-medium flex items-center gap-2 mt-1">
                                            <Mail className="h-4 w-4" />
                                            {profile.email}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset font-display ${profile.role === 'manager'
                                                    ? 'bg-primary/10 text-primary ring-primary/20'
                                                    : 'bg-secondary/10 text-secondary ring-secondary/20'
                                                }`}>
                                                {profile.role === 'manager' ? 'Manager' : 'Staff'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Form / Details */}
                                {isEditing ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="h-11"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="flex gap-3 justify-end pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={handleCancel}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="min-w-[100px]"
                                            >
                                                {isSaving ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                                            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-primary/20 transition-all hover:shadow-md group">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">First Name</p>
                                                <p className="font-bold text-slate-900 text-lg font-display">{profile.firstName}</p>
                                            </div>

                                            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-primary/20 transition-all hover:shadow-md group">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">Last Name</p>
                                                <p className="font-bold text-slate-900 text-lg font-display">{profile.lastName}</p>
                                            </div>

                                            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-primary/20 transition-all hover:shadow-md group">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">Role</p>
                                                <p className="font-bold text-slate-900 text-lg font-display capitalize">{profile.role}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsChangingPassword(true)}
                                            >
                                                <Key className="mr-2 h-4 w-4" />
                                                Change Password
                                            </Button>
                                            <Button onClick={() => setIsEditing(true)}>
                                                Edit Profile
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
