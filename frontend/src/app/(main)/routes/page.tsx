"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    MapPin, 
    Plus, 
    Truck, 
    Navigation,
    Clock,
    TrendingUp,
    Route as RouteIcon,
    Play
} from "lucide-react";
import api from "@/lib/api";

interface DeliveryPoint {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    priority: 'high' | 'medium' | 'low';
}

export default function SmartRoutePage() {
    const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [startLocation, setStartLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [routeResult, setRouteResult] = useState<any>(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    async function fetchVehicles() {
        try {
            const response = await api.axiosInstance.get('/api/v1/vehicles');
            if (response.data) {
                setVehicles(response.data.data || response.data.vehicles || []);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }

    function addDeliveryPoint() {
        const newPoint: DeliveryPoint = {
            id: Date.now().toString(),
            address: "",
            latitude: 0,
            longitude: 0,
            priority: 'medium'
        };
        setDeliveryPoints([...deliveryPoints, newPoint]);
    }

    function updateDeliveryPoint(id: string, field: keyof DeliveryPoint, value: any) {
        setDeliveryPoints(deliveryPoints.map(point => 
            point.id === id ? { ...point, [field]: value } : point
        ));
    }

    function removeDeliveryPoint(id: string) {
        setDeliveryPoints(deliveryPoints.filter(point => point.id !== id));
    }

    async function generateRoute() {
        if (!selectedVehicle || !startLocation || deliveryPoints.length === 0) {
            alert("Please fill in all required fields and add at least one delivery point");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.axiosInstance.post('/api/v1/routes/generate', {
                vehicleId: selectedVehicle,
                startLocation,
                deliveryPoints
            });

            if (response.data) {
                setRouteResult(response.data.data || response.data);
                console.log('%c🗺️ Route Generated!', 'color: #10b981; font-size: 14px; font-weight: bold;');
            }
        } catch (error: any) {
            console.error('Error generating route:', error);
            alert(error.response?.data?.message || 'Failed to generate route');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Smart Route Planning</h1>
                    <p className="text-gray-600 mt-1">Plan optimal delivery routes for your fleet</p>
                </div>
                <Button 
                    onClick={generateRoute}
                    disabled={isLoading || !selectedVehicle || deliveryPoints.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Play className="h-4 w-4 mr-2" />
                    {isLoading ? "Generating..." : "Generate Route"}
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Delivery Points</p>
                            <p className="text-2xl font-bold">{deliveryPoints.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Truck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Available Vehicles</p>
                            <p className="text-2xl font-bold">{vehicles.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Est. Time</p>
                            <p className="text-2xl font-bold">{routeResult?.estimatedTime || '--'}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Est. Distance</p>
                            <p className="text-2xl font-bold">{routeResult?.totalDistance || '--'}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Route Configuration */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <RouteIcon className="h-5 w-5" />
                        Route Configuration
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="vehicle">Select Vehicle *</Label>
                            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a vehicle" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {vehicles.map((v) => (
                                        <SelectItem key={v._id} value={v._id}>
                                            {v.vehicleNumber} - {v.type} ({v.capacity}kg)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startLocation">Start Location *</Label>
                            <Input
                                id="startLocation"
                                value={startLocation}
                                onChange={(e) => setStartLocation(e.target.value)}
                                placeholder="Enter warehouse or starting address"
                            />
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">Delivery Points</h3>
                                <Button size="sm" onClick={addDeliveryPoint}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Point
                                </Button>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {deliveryPoints.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        No delivery points added yet
                                    </p>
                                ) : (
                                    deliveryPoints.map((point, index) => (
                                        <div key={point.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Point {index + 1}</span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeDeliveryPoint(point.id)}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                            <Input
                                                placeholder="Delivery address"
                                                value={point.address}
                                                onChange={(e) => updateDeliveryPoint(point.id, 'address', e.target.value)}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Latitude"
                                                    value={point.latitude || ''}
                                                    onChange={(e) => updateDeliveryPoint(point.id, 'latitude', parseFloat(e.target.value) || 0)}
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Longitude"
                                                    value={point.longitude || ''}
                                                    onChange={(e) => updateDeliveryPoint(point.id, 'longitude', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                            <Select 
                                                value={point.priority} 
                                                onValueChange={(value: any) => updateDeliveryPoint(point.id, 'priority', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    <SelectItem value="high">High Priority</SelectItem>
                                                    <SelectItem value="medium">Medium Priority</SelectItem>
                                                    <SelectItem value="low">Low Priority</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Route Preview */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Navigation className="h-5 w-5" />
                        Route Preview
                    </h2>
                    
                    {!routeResult ? (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                            <RouteIcon className="h-16 w-16 mb-4" />
                            <p>Generate a route to see preview</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Route Summary</h3>
                                <div className="space-y-1 text-sm">
                                    <p>Total Distance: <span className="font-medium">{routeResult.totalDistance}</span></p>
                                    <p>Estimated Time: <span className="font-medium">{routeResult.estimatedTime}</span></p>
                                    <p>Stops: <span className="font-medium">{routeResult.stops || deliveryPoints.length}</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Route Sequence</h3>
                                <div className="space-y-2">
                                    {deliveryPoints.map((point, index) => (
                                        <div key={point.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{point.address || `Stop ${index + 1}`}</p>
                                                <p className="text-xs text-gray-500">{point.priority} priority</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
