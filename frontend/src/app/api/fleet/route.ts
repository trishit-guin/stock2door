import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Return dummy fleet data for demo
        const dummyFleetData = {
            vehicles: [
                {
                    _id: "veh-001",
                    vehicleNumber: "MH-02-AB-1234",
                    type: "Truck",
                    model: "Tata LPT 1618",
                    capacity: 10000,
                    currentLoad: 6500,
                    fuelType: "Diesel",
                    status: "active",
                    driver: {
                        _id: "drv-001",
                        name: "Suresh Patil",
                        phone: "+91 98765 11111",
                        licenseNumber: "MH0120240001234"
                    },
                    currentLocation: "Mumbai",
                    lastMaintenance: new Date("2024-11-15"),
                    nextMaintenance: new Date("2025-02-15"),
                    mileage: 45230
                },
                {
                    _id: "veh-002",
                    vehicleNumber: "DL-01-CD-5678",
                    type: "Truck",
                    model: "Ashok Leyland 1820",
                    capacity: 12000,
                    currentLoad: 8400,
                    fuelType: "Diesel",
                    status: "in_transit",
                    driver: {
                        _id: "drv-002",
                        name: "Ramesh Kumar",
                        phone: "+91 98765 22222",
                        licenseNumber: "DL0120240002345"
                    },
                    currentLocation: "Delhi to Bangalore",
                    lastMaintenance: new Date("2024-10-20"),
                    nextMaintenance: new Date("2025-01-20"),
                    mileage: 52100
                },
                {
                    _id: "veh-003",
                    vehicleNumber: "KA-03-EF-9012",
                    type: "Van",
                    model: "Mahindra Bolero Pickup",
                    capacity: 2500,
                    currentLoad: 0,
                    fuelType: "CNG",
                    status: "active",
                    driver: {
                        _id: "drv-003",
                        name: "Venkatesh Rao",
                        phone: "+91 98765 33333",
                        licenseNumber: "KA0320240003456"
                    },
                    currentLocation: "Bangalore",
                    lastMaintenance: new Date("2024-12-01"),
                    nextMaintenance: new Date("2025-03-01"),
                    mileage: 28450
                },
                {
                    _id: "veh-004",
                    vehicleNumber: "TN-09-GH-3456",
                    type: "Truck",
                    model: "Eicher Pro 3015",
                    capacity: 8000,
                    currentLoad: 5200,
                    fuelType: "Diesel",
                    status: "in_transit",
                    driver: {
                        _id: "drv-004",
                        name: "Murugan Selvam",
                        phone: "+91 98765 44444",
                        licenseNumber: "TN0920240004567"
                    },
                    currentLocation: "Chennai to Ahmedabad",
                    lastMaintenance: new Date("2024-11-10"),
                    nextMaintenance: new Date("2025-02-10"),
                    mileage: 39870
                },
                {
                    _id: "veh-005",
                    vehicleNumber: "GJ-01-IJ-7890",
                    type: "Van",
                    model: "Tata Ace EV",
                    capacity: 1500,
                    currentLoad: 0,
                    fuelType: "Electric",
                    status: "maintenance",
                    driver: {
                        _id: "drv-005",
                        name: "Rajesh Mehta",
                        phone: "+91 98765 55555",
                        licenseNumber: "GJ0120240005678"
                    },
                    currentLocation: "Ahmedabad Service Center",
                    lastMaintenance: new Date("2024-12-06"),
                    nextMaintenance: new Date("2025-03-06"),
                    mileage: 15240
                },
                {
                    _id: "veh-006",
                    vehicleNumber: "WB-01-KL-2345",
                    type: "Van",
                    model: "Force Traveller",
                    capacity: 3000,
                    currentLoad: 1800,
                    fuelType: "CNG",
                    status: "active",
                    driver: {
                        _id: "drv-006",
                        name: "Arijit Banerjee",
                        phone: "+91 98765 66666",
                        licenseNumber: "WB0120240006789"
                    },
                    currentLocation: "Kolkata",
                    lastMaintenance: new Date("2024-11-25"),
                    nextMaintenance: new Date("2025-02-25"),
                    mileage: 33210
                },
                {
                    _id: "veh-007",
                    vehicleNumber: "MH-05-XY-8901",
                    type: "Bike",
                    model: "Hero Splendor",
                    capacity: 50,
                    currentLoad: 15,
                    fuelType: "Petrol",
                    status: "active",
                    driver: {
                        _id: "drv-007",
                        name: "Amit Deshmukh",
                        phone: "+91 98765 77777",
                        licenseNumber: "MH0520240007890"
                    },
                    currentLocation: "Mumbai",
                    lastMaintenance: new Date("2024-11-20"),
                    nextMaintenance: new Date("2025-02-20"),
                    mileage: 18500
                },
                {
                    _id: "veh-008",
                    vehicleNumber: "DL-03-PQ-4567",
                    type: "Bike",
                    model: "Honda Activa",
                    capacity: 40,
                    currentLoad: 0,
                    fuelType: "Petrol",
                    status: "active",
                    driver: {
                        _id: "drv-008",
                        name: "Neha Singh",
                        phone: "+91 98765 88888",
                        licenseNumber: "DL0320240008901"
                    },
                    currentLocation: "Delhi",
                    lastMaintenance: new Date("2024-12-02"),
                    nextMaintenance: new Date("2025-03-02"),
                    mileage: 12300
                },
                {
                    _id: "veh-009",
                    vehicleNumber: "KA-05-RS-2468",
                    type: "Van",
                    model: "Mahindra eVerito",
                    capacity: 2000,
                    currentLoad: 800,
                    fuelType: "Electric",
                    status: "active",
                    driver: {
                        _id: "drv-009",
                        name: "Priya Reddy",
                        phone: "+91 98765 99999",
                        licenseNumber: "KA0520240009012"
                    },
                    currentLocation: "Bangalore",
                    lastMaintenance: new Date("2024-11-28"),
                    nextMaintenance: new Date("2025-02-28"),
                    mileage: 9800
                },
                {
                    _id: "veh-010",
                    vehicleNumber: "TN-01-UV-1357",
                    type: "Truck",
                    model: "BharatBenz 1617R",
                    capacity: 11000,
                    currentLoad: 7200,
                    fuelType: "Diesel",
                    status: "in_transit",
                    driver: {
                        _id: "drv-010",
                        name: "Karthik Swamy",
                        phone: "+91 98765 10101",
                        licenseNumber: "TN0120240010123"
                    },
                    currentLocation: "Chennai to Mumbai",
                    lastMaintenance: new Date("2024-11-18"),
                    nextMaintenance: new Date("2025-02-18"),
                    mileage: 48700
                }
            ],
            statistics: {
                totalVehicles: 10,
                activeVehicles: 5,
                inTransit: 3,
                underMaintenance: 1,
                idle: 1,
                totalCapacity: 49090,
                currentUtilization: 29915,
                utilizationPercentage: 60.9,
                avgMileage: 30250,
                byFuelType: {
                    Diesel: 4,
                    CNG: 2,
                    Electric: 2,
                    Petrol: 2
                },
                byType: {
                    Truck: 4,
                    Van: 4,
                    Bike: 2
                },
                byStatus: {
                    active: 5,
                    in_transit: 3,
                    maintenance: 1,
                    idle: 1
                }
            },
            routes: [
                {
                    _id: "route-001",
                    name: "Mumbai to Delhi Express",
                    distance: 1420,
                    estimatedTime: "24 hours",
                    stops: ["Mumbai", "Surat", "Ahmedabad", "Jaipur", "Delhi"],
                    vehicleId: "veh-002",
                    status: "active"
                },
                {
                    _id: "route-002",
                    name: "Chennai to Ahmedabad Route",
                    distance: 1870,
                    estimatedTime: "32 hours",
                    stops: ["Chennai", "Bangalore", "Pune", "Ahmedabad"],
                    vehicleId: "veh-004",
                    status: "active"
                },
                {
                    _id: "route-003",
                    name: "Bangalore Local Distribution",
                    distance: 50,
                    estimatedTime: "4 hours",
                    stops: ["Bangalore Warehouse", "Whitefield", "Electronic City", "BTM Layout"],
                    vehicleId: "veh-003",
                    status: "completed"
                }
            ],
            maintenance: [
                {
                    _id: "maint-001",
                    vehicleId: "veh-005",
                    vehicleNumber: "GJ-01-IJ-7890",
                    type: "Regular Service",
                    status: "in_progress",
                    scheduledDate: new Date("2024-12-06"),
                    estimatedCost: 8500,
                    notes: "Engine oil change, brake inspection, tire rotation"
                },
                {
                    _id: "maint-002",
                    vehicleId: "veh-002",
                    vehicleNumber: "DL-01-CD-5678",
                    type: "Scheduled Maintenance",
                    status: "scheduled",
                    scheduledDate: new Date("2025-01-20"),
                    estimatedCost: 15000,
                    notes: "Major service due at 60,000 km"
                },
                {
                    _id: "maint-003",
                    vehicleId: "veh-001",
                    vehicleNumber: "MH-02-AB-1234",
                    type: "Scheduled Maintenance",
                    status: "scheduled",
                    scheduledDate: new Date("2025-02-15"),
                    estimatedCost: 12000,
                    notes: "Regular service and safety check"
                }
            ]
        };

        return NextResponse.json(dummyFleetData);
    } catch (error) {
        console.error("Error fetching fleet data:", error);
        return NextResponse.json(
            { message: "Failed to fetch fleet data" },
            { status: 500 }
        );
    }
}
