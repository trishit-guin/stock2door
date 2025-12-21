"use client";

import { X, User, Mail, Briefcase, Calendar, Key, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface ProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserProfile {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
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
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
            const data = await api.getMe();
            const userData = data.data || data;
            setProfile(userData);
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load profile");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave() {
        if (!profile) return;

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Update profile using backend API
            const response = await api.axiosInstance.put('/auth/profile', {
                firstName,
                lastName,
                email
            });

            if (response.data) {
                const updatedData = response.data.data || response.data;
                setProfile(updatedData);
                setIsEditing(false);
                setSuccess("Profile updated successfully!");
                
                // Success message with styling
                console.log(
                    '%c✅ Profile Updated!',
                    'color: #10b981; font-size: 14px; font-weight: bold; padding: 4px;'
                );
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
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
        setSuccess(null);
    }

    async function handleChangePassword() {
        if (!currentPassword) {
            setError("Current password is required");
            return;
        }

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
            const response = await api.axiosInstance.put('/auth/change-password', {
                currentPassword,
                newPassword
            });

            if (response.data) {
                setSuccess("Password changed successfully!");
                
                // Success message with styling
                console.log(
                    '%c🔐 Password Changed!',
                    'color: #10b981; font-size: 14px; font-weight: bold; padding: 4px;'
                );
                
                // Reset form
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setIsChangingPassword(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to change password");
            console.error(err);
        } finally {
            setIsChangingPwd(false);
        }
    }

    function handleCancelPasswordChange() {
        setIsChangingPassword(false);
        setCurrentPassword("");
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

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
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
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                                            disabled={isChangingPwd || !currentPassword || !newPassword || !confirmPassword}
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
                                </div>
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
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset font-display ${
                                                profile.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-700 ring-purple-200'
                                                    : profile.role === 'inventory_manager'
                                                    ? 'bg-primary/10 text-primary ring-primary/20'
                                                    : 'bg-secondary/10 text-secondary ring-secondary/20'
                                                }`}>
                                                {profile.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
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
