import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Return dummy analytics data for demo - matching fleet/logistics structure
        const dummyAnalyticsData = {
            kpis: {
                totalCO2Saved: 12450, // kg CO2
                activeRoutes: 28,
                fleetEfficiency: 86, // percentage
                costSavings: 245000, // in rupees
                totalVehicles: 10,
                evAdoptionRate: 20, // 2 EVs out of 10 vehicles = 20%
                routeEfficiencyScore: 88,
                totalDistanceSaved: 4850 // km
            },
            fleetComposition: {
                byType: {
                    "Truck": 4,
                    "Van": 4,
                    "Bike": 2
                },
                byFuelType: {
                    "Diesel": 4,
                    "CNG": 2,
                    "Electric": 2,
                    "Petrol": 2
                }
            },
            recentRoutes: [
                {
                    id: "route-001",
                    name: "Mumbai to Pune Express",
                    distance: 148,
                    duration: 180,
                    emissions: 245,
                    status: "Excellent",
                    vehicle: {
                        model: "Tata LPT 1618",
                        fuelType: "Diesel"
                    },
                    deliveries: [
                        { id: "del-001", location: "Pune" },
                        { id: "del-002", location: "Lonavala" }
                    ],
                    createdAt: "2024-12-05T08:30:00Z"
                },
                {
                    id: "route-002",
                    name: "Delhi to Gurgaon Local",
                    distance: 32,
                    duration: 45,
                    emissions: 45,
                    status: "Good",
                    vehicle: {
                        model: "Mahindra eVerito",
                        fuelType: "Electric"
                    },
                    deliveries: [
                        { id: "del-003", location: "Gurgaon Sector 18" }
                    ],
                    createdAt: "2024-12-05T10:15:00Z"
                },
                {
                    id: "route-003",
                    name: "Bangalore City Distribution",
                    distance: 45,
                    duration: 90,
                    emissions: 68,
                    status: "Optimized",
                    vehicle: {
                        model: "Mahindra Bolero Pickup",
                        fuelType: "CNG"
                    },
                    deliveries: [
                        { id: "del-004", location: "Indiranagar" },
                        { id: "del-005", location: "Koramangala" },
                        { id: "del-006", location: "HSR Layout" }
                    ],
                    createdAt: "2024-12-04T14:20:00Z"
                },
                {
                    id: "route-004",
                    name: "Chennai to Coimbatore Highway",
                    distance: 502,
                    duration: 480,
                    emissions: 820,
                    status: "Good",
                    vehicle: {
                        model: "Ashok Leyland 1820",
                        fuelType: "Diesel"
                    },
                    deliveries: [
                        { id: "del-007", location: "Salem" },
                        { id: "del-008", location: "Erode" },
                        { id: "del-009", location: "Coimbatore" }
                    ],
                    createdAt: "2024-12-03T06:00:00Z"
                },
                {
                    id: "route-005",
                    name: "Ahmedabad Local Express",
                    distance: 28,
                    duration: 40,
                    emissions: 12,
                    status: "Excellent",
                    vehicle: {
                        model: "Tata Ace EV",
                        fuelType: "Electric"
                    },
                    deliveries: [
                        { id: "del-010", location: "Satellite" },
                        { id: "del-011", location: "Vastrapur" }
                    ],
                    createdAt: "2024-12-02T09:45:00Z"
                },
                {
                    id: "route-006",
                    name: "Kolkata Port to Warehouse",
                    distance: 65,
                    duration: 120,
                    emissions: 95,
                    status: "Good",
                    vehicle: {
                        model: "Force Traveller",
                        fuelType: "CNG"
                    },
                    deliveries: [
                        { id: "del-012", location: "Salt Lake" },
                        { id: "del-013", location: "New Town" }
                    ],
                    createdAt: "2024-12-01T11:30:00Z"
                }
            ]
        };

        return NextResponse.json(dummyAnalyticsData);
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        return NextResponse.json(
            { message: "Failed to fetch analytics data" },
            { status: 500 }
        );
    }
}
