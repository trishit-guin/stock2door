"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
    Users as UsersIcon, 
    Search, 
    UserPlus,
    Shield,
    Mail,
    Calendar,
    X
} from "lucide-react";
import api from "@/lib/api";

interface User {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "warehouse_staff",
        inventoryId: "",
        warehouseId: ""
    });
    const [inventories, setInventories] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers();
        fetchInventories();
        fetchWarehouses();
    }, []);

    async function fetchUsers() {
        setIsLoading(true);
        try {
            const response = await api.axiosInstance.get('/users');
            if (response.data) {
                setUsers(response.data.data || response.data.users || []);
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchInventories() {
        try {
            const response = await api.axiosInstance.get('/inventories');
            if (response.data) {
                setInventories(response.data.data || response.data.inventories || response.data || []);
            }
        } catch (error: any) {
            console.error('Error fetching inventories:', error);
        }
    }

    async function fetchWarehouses() {
        try {
            const response = await api.axiosInstance.get('/warehouses');
            if (response.data) {
                setWarehouses(response.data.data || response.data.warehouses || response.data || []);
            }
        } catch (error: any) {
            console.error('Error fetching warehouses:', error);
        }
    }

    async function handleCreateUser(e: React.FormEvent) {
        e.preventDefault();
        setIsCreating(true);
        
        try {
            await api.axiosInstance.post('/users', newUser);
            alert('User created successfully!');
            setShowCreateModal(false);
            setNewUser({
                username: "",
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                phone: "",
                role: "warehouse_staff",
                inventoryId: "",
                warehouseId: ""
            });
            fetchUsers();
        } catch (error: any) {
            console.error('Error creating user:', error);
            alert(error.response?.data?.message || 'Failed to create user');
        } finally {
            setIsCreating(false);
        }
    }

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function getRoleBadgeColor(role: string) {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'inventory_manager': return 'bg-green-100 text-green-700';
            case 'environment_manager': return 'bg-blue-100 text-blue-700';
            case 'warehouse_staff': return 'bg-gray-100 text-gray-700';
            case 'auditor': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    function getRoleDisplayName(role: string) {
        return role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage system users and their roles</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="bg-[#1A73E8] hover:bg-[#1557b0]">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                </Button>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Create New User</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">First Name *</label>
                                    <Input
                                        value={newUser.firstName}
                                        onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                                        required
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                                    <Input
                                        value={newUser.lastName}
                                        onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                                        required
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Username *</label>
                                <Input
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                    required
                                    placeholder="johndoe"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <Input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Password *</label>
                                <Input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    required
                                    minLength={6}
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <Input
                                    type="tel"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                                    placeholder="+1234567890"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Role *</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value, inventoryId: "", warehouseId: ""})}
                                    required
                                >
                                    <option value="admin">Admin</option>
                                    <option value="inventory_manager">Inventory Manager</option>
                                    <option value="warehouse_staff">Warehouse Staff</option>
                                    <option value="environment_manager">Environment Manager</option>
                                    <option value="auditor">Auditor</option>
                                </select>
                            </div>
                            
                            {newUser.role === "inventory_manager" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Assign to Inventory (Optional)</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newUser.inventoryId}
                                        onChange={(e) => setNewUser({...newUser, inventoryId: e.target.value})}
                                    >
                                        <option value="">-- No Assignment --</option>
                                        {inventories.map((inv) => (
                                            <option key={inv._id} value={inv._id}>
                                                {inv.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Assign this manager to an unassigned inventory</p>
                                </div>
                            )}
                            
                            {newUser.role === "warehouse_staff" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Assign to Warehouse (Optional)</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newUser.warehouseId}
                                        onChange={(e) => setNewUser({...newUser, warehouseId: e.target.value})}
                                    >
                                        <option value="">-- No Assignment --</option>
                                        {warehouses.map((wh) => (
                                            <option key={wh._id} value={wh._id}>
                                                {wh.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Assign this staff to an unassigned warehouse</p>
                                </div>
                            )}
                            
                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1"
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="flex-1 bg-[#1A73E8] hover:bg-[#1557b0]"
                                    disabled={isCreating}
                                >
                                    {isCreating ? "Creating..." : "Create User"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Search Bar */}
            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, email, or username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <UsersIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold">{users.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Admins</p>
                            <p className="text-2xl font-bold">
                                {users.filter(u => u.role === 'admin').length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <UsersIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Managers</p>
                            <p className="text-2xl font-bold">
                                {users.filter(u => u.role.includes('manager')).length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <UsersIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Staff</p>
                            <p className="text-2xl font-bold">
                                {users.filter(u => u.role === 'warehouse_staff').length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center">
                        <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">No users found</p>
                        <p className="text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search' : 'No users in the system'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold">
                                                        {user.firstName[0]}{user.lastName[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="h-4 w-4" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleDisplayName(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                user.isActive 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
