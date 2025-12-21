"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
    Package,
    Search,
    Plus,
    X,
    Mail,
    Phone,
    MapPin,
    Building
} from "lucide-react";
import api from "@/lib/api";

interface Inventory {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
    taxId?: string;
    status: string;
    createdAt: string;
}

export default function InventoriesPage() {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newInventory, setNewInventory] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
        },
        taxId: ""
    });

    useEffect(() => {
        fetchInventories();
    }, []);

    async function fetchInventories() {
        setIsLoading(true);
        try {
            const response = await api.axiosInstance.get('/inventories');
            if (response.data) {
                setInventories(response.data.data || response.data || []);
            }
        } catch (error: any) {
            console.error('Error fetching inventories:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateInventory(e: React.FormEvent) {
        e.preventDefault();
        setIsCreating(true);
        
        try {
            await api.axiosInstance.post('/inventories', newInventory);
            alert('Inventory created successfully!');
            setShowCreateModal(false);
            setNewInventory({
                name: "",
                email: "",
                phone: "",
                address: {
                    street: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: ""
                },
                taxId: ""
            });
            fetchInventories();
        } catch (error: any) {
            console.error('Error creating inventory:', error);
            alert(error.response?.data?.message || 'Failed to create inventory');
        } finally {
            setIsCreating(false);
        }
    }

    const filteredInventories = inventories.filter(inv =>
        inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function getStatusBadgeColor(status: string) {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'inactive': return 'bg-gray-100 text-gray-700';
            case 'suspended': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600 mt-1">Manage business inventories and their settings</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="bg-[#1A73E8] hover:bg-[#1557b0]">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Inventory
                </Button>
            </div>

            {/* Create Inventory Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Create New Inventory</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <form onSubmit={handleCreateInventory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Inventory Name *</label>
                                <Input
                                    value={newInventory.name}
                                    onChange={(e) => setNewInventory({...newInventory, name: e.target.value})}
                                    required
                                    placeholder="Main Warehouse Inventory"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email *</label>
                                    <Input
                                        type="email"
                                        value={newInventory.email}
                                        onChange={(e) => setNewInventory({...newInventory, email: e.target.value})}
                                        required
                                        placeholder="inventory@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone *</label>
                                    <Input
                                        type="tel"
                                        value={newInventory.phone}
                                        onChange={(e) => setNewInventory({...newInventory, phone: e.target.value})}
                                        required
                                        placeholder="+1234567890"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Tax ID (Optional)</label>
                                <Input
                                    value={newInventory.taxId}
                                    onChange={(e) => setNewInventory({...newInventory, taxId: e.target.value})}
                                    placeholder="Tax Identification Number"
                                />
                            </div>
                            
                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold mb-3">Address (Optional)</h3>
                                <div className="space-y-3">
                                    <Input
                                        value={newInventory.address.street}
                                        onChange={(e) => setNewInventory({...newInventory, address: {...newInventory.address, street: e.target.value}})}
                                        placeholder="Street Address"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            value={newInventory.address.city}
                                            onChange={(e) => setNewInventory({...newInventory, address: {...newInventory.address, city: e.target.value}})}
                                            placeholder="City"
                                        />
                                        <Input
                                            value={newInventory.address.state}
                                            onChange={(e) => setNewInventory({...newInventory, address: {...newInventory.address, state: e.target.value}})}
                                            placeholder="State"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            value={newInventory.address.country}
                                            onChange={(e) => setNewInventory({...newInventory, address: {...newInventory.address, country: e.target.value}})}
                                            placeholder="Country"
                                        />
                                        <Input
                                            value={newInventory.address.zipCode}
                                            onChange={(e) => setNewInventory({...newInventory, address: {...newInventory.address, zipCode: e.target.value}})}
                                            placeholder="Zip Code"
                                        />
                                    </div>
                                </div>
                            </div>
                            
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
                                    {isCreating ? "Creating..." : "Create Inventory"}
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
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Inventories</p>
                            <p className="text-2xl font-bold">{inventories.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold">
                                {inventories.filter(i => i.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Package className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Inactive</p>
                            <p className="text-2xl font-bold">
                                {inventories.filter(i => i.status !== 'active').length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Inventories Grid */}
            <Card>
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading inventories...</p>
                    </div>
                ) : filteredInventories.length === 0 ? (
                    <div className="p-12 text-center">
                        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">No inventories found</p>
                        <p className="text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search' : 'Create your first inventory to get started'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 p-4 md:grid-cols-2">
                        {filteredInventories.map((inventory) => (
                            <Card key={inventory._id} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Building className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{inventory.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(inventory.status)}`}>
                                                {inventory.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {inventory.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {inventory.phone}
                                    </div>
                                    {inventory.address?.city && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {inventory.address.city}, {inventory.address.state}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
