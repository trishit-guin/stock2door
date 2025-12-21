"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    FileText, 
    Download, 
    Plus, 
    Search, 
    Calendar,
    DollarSign,
    Package,
    Building2,
    Trash2
} from "lucide-react";
import api from "@/lib/api";
import { useUserRole } from "@/hooks/useUserRole";

interface Invoice {
    _id: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail?: string;
    warehouseId: {
        _id: string;
        name: string;
    };
    items: {
        productId: {
            _id: string;
            name: string;
            sku: string;
        };
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    subtotal: number;
    tax: number;
    totalAmount: number;
    status: 'draft' | 'issued' | 'paid' | 'cancelled';
    issueDate: string;
    dueDate: string;
    createdBy: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { isReadOnly } = useUserRole();
    
    // Form states
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [warehouseId, setWarehouseId] = useState("");
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [items, setItems] = useState<{productId: string; quantity: number; unitPrice: number}[]>([
        {productId: "", quantity: 1, unitPrice: 0}
    ]);
    const [tax, setTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchInvoices();
        fetchWarehouses();
        fetchProducts();
    }, []);

    async function fetchInvoices() {
        setIsLoading(true);
        try {
            const response = await api.axiosInstance.get('/invoices');
            if (response.data) {
                setInvoices(response.data.data || response.data.invoices || []);
            }
        } catch (error: any) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchWarehouses() {
        try {
            const response = await api.axiosInstance.get('/warehouses');
            if (response.data) {
                setWarehouses(response.data.data || response.data.warehouses || []);
            }
        } catch (error: any) {
            console.error('Error fetching warehouses:', error);
        }
    }

    async function fetchProducts() {
        try {
            const response = await api.axiosInstance.get('/products');
            if (response.data) {
                setProducts(response.data.data || response.data.products || []);
            }
        } catch (error: any) {
            console.error('Error fetching products:', error);
        }
    }

    function addItem() {
        setItems([...items, {productId: "", quantity: 1, unitPrice: 0}]);
    }

    function removeItem(index: number) {
        setItems(items.filter((_, i) => i !== index));
    }

    function updateItem(index: number, field: string, value: any) {
        const newItems = [...items];
        newItems[index] = {...newItems[index], [field]: value};
        setItems(newItems);
    }

    function calculateSubtotal() {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }

    function calculateTotal() {
        const subtotal = calculateSubtotal();
        return subtotal + tax - discount;
    }

    async function handleCreateInvoice() {
        if (!customerName || !warehouseId || items.length === 0) {
            alert("Please fill in all required fields");
            return;
        }

        const invalidItems = items.filter(item => !item.productId || item.quantity <= 0 || item.unitPrice < 0);
        if (invalidItems.length > 0) {
            alert("Please fill in all item details correctly");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.axiosInstance.post('/invoices', {
                customerName,
                customerEmail,
                customerPhone,
                customerAddress,
                warehouseId,
                items,
                tax,
                discount,
                notes
            });

            if (response.data) {
                console.log('%c✅ Invoice Created!', 'color: #10b981; font-size: 14px; font-weight: bold;');
                setIsCreateModalOpen(false);
                resetForm();
                fetchInvoices();
            }
        } catch (error: any) {
            console.error('Error creating invoice:', error);
            alert(error.response?.data?.message || 'Failed to create invoice');
        } finally {
            setIsSubmitting(false);
        }
    }

    function resetForm() {
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setCustomerAddress("");
        setWarehouseId("");
        setItems([{productId: "", quantity: 1, unitPrice: 0}]);
        setTax(0);
        setDiscount(0);
        setNotes("");
    }

    const filteredInvoices = invoices.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleDownloadInvoice(invoiceId: string) {
        try {
            const response = await api.axiosInstance.get(`/api/v1/invoices/${invoiceId}/pdf`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error: any) {
            console.error('Error downloading invoice:', error);
            alert('Failed to download invoice');
        }
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'issued': return 'bg-blue-100 text-blue-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Invoice Generation</h1>
                    <p className="text-gray-600 mt-1">Create and manage invoices for stock movements</p>
                </div>
                {!isReadOnly && (
                    <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Invoice
                    </Button>
                )}
            </div>

            {/* Search Bar */}
            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by invoice number or customer name..."
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
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Invoices</p>
                            <p className="text-2xl font-bold">{invoices.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-green-600 font-bold text-lg">₹</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Paid</p>
                            <p className="text-2xl font-bold">
                                {invoices.filter(i => i.status === 'paid').length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Issued</p>
                            <p className="text-2xl font-bold">
                                {invoices.filter(i => i.status === 'issued').length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Drafts</p>
                            <p className="text-2xl font-bold">
                                {invoices.filter(i => i.status === 'draft').length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Invoices Table */}
            <Card>
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-2 text-gray-600">Loading invoices...</p>
                    </div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">No invoices found</p>
                        <p className="text-sm text-gray-500 mb-4">
                            {searchTerm ? 'Try adjusting your search' : 'Create your first invoice to get started'}
                        </p>
                        {!searchTerm && !isReadOnly && (
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Invoice
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Warehouse
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Issue Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">
                                                    {invoice.invoiceNumber}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{invoice.customerName}</p>
                                                {invoice.customerEmail && (
                                                    <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {invoice.warehouseId?.name || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-semibold text-gray-900">
                                                ₹{invoice.totalAmount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {new Date(invoice.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDownloadInvoice(invoice._id)}
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Create Invoice Modal - Placeholder */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsCreateModalOpen(false)}>
                    <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Create Invoice</h2>
                            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                                ✕
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="customerName">Customer Name *</Label>
                                        <Input
                                            id="customerName"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customerEmail">Email</Label>
                                        <Input
                                            id="customerEmail"
                                            type="email"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customerPhone">Phone</Label>
                                        <Input
                                            id="customerPhone"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="warehouse">Warehouse *</Label>
                                        <Select value={warehouseId} onValueChange={setWarehouseId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select warehouse" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {warehouses.map((w) => (
                                                    <SelectItem key={w._id} value={w._id}>
                                                        {w.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="customerAddress">Address</Label>
                                        <Input
                                            id="customerAddress"
                                            value={customerAddress}
                                            onChange={(e) => setCustomerAddress(e.target.value)}
                                            placeholder="123 Main St, City, Country"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Items */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Invoice Items</h3>
                                    <Button type="button" size="sm" onClick={addItem}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Item
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 space-y-2">
                                                <Label>Product *</Label>
                                                <Select 
                                                    value={item.productId} 
                                                    onValueChange={(value) => updateItem(index, 'productId', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select product" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        {products.map((p) => (
                                                            <SelectItem key={p._id} value={p._id}>
                                                                {p.name} ({p.sku})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <Label>Quantity *</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <Label>Unit Price *</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unitPrice}
                                                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <Label>Total</Label>
                                                <Input
                                                    value={`₹${(item.quantity * item.unitPrice).toFixed(2)}`}
                                                    disabled
                                                    className="bg-gray-100"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                                disabled={items.length === 1}
                                                className="mb-2"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="border-t pt-4">
                                <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
                                    <div className="space-y-2">
                                        <Label htmlFor="tax">Tax (₹)</Label>
                                        <Input
                                            id="tax"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={tax}
                                            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discount">Discount (₹)</Label>
                                        <Input
                                            id="discount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={discount}
                                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 text-right space-y-2">
                                    <p className="text-lg">Subtotal: <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span></p>
                                    <p className="text-2xl font-bold">Total: <span className="text-blue-600">₹{calculateTotal().toFixed(2)}</span></p>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Additional notes or instructions"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsCreateModalOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleCreateInvoice}
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isSubmitting ? "Creating..." : "Create Invoice"}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
