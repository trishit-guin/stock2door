"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Briefcase, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const user = await api.getMe();
            setUser(user);
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await api.axiosInstance.put('/api/v1/auth/profile', formData);
            if (response.data) {
                setUser(response.data);
                setIsEditing(false);
                alert("Profile updated successfully!");
            }
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    }

    function handleCancel() {
        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
        });
        setIsEditing(false);
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto">
                <p className="text-center text-gray-500">Failed to load profile</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">View and manage your account information</p>
            </div>

            {/* Profile Header Card */}
            <Card className="p-6">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user.firstName?.charAt(0) || "U"}{user.lastName?.charAt(0) || ""}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="mt-2">
                            <Badge className={user.role === "manager" ? "bg-purple-500" : "bg-blue-500"}>
                                {user.role === "manager" ? "Manager" : "Staff"}
                            </Badge>
                        </div>
                    </div>
                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                            Edit Profile
                        </Button>
                    )}
                </div>
            </Card>

            {/* Profile Details */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Account Information</h3>
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input value={user.role === "manager" ? "Manager" : "Staff"} disabled />
                            <p className="text-xs text-gray-500">Contact administrator to change role</p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    First Name
                                </Label>
                                <Input value={user.firstName} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Last Name
                                </Label>
                                <Input value={user.lastName} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </Label>
                                <Input value={user.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Role
                                </Label>
                                <Input value={user.role === "manager" ? "Manager" : "Staff"} disabled />
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Change Password Section */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Security</h3>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        To change your password, please contact your system administrator.
                    </p>
                    <Button variant="outline" disabled>
                        Request Password Change
                    </Button>
                </div>
            </Card>
        </div>
    );
}
