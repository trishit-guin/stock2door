import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Warehouse from "@/lib/models/Warehouse";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

async function verifyRole(allowedRoles: string[]) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (allowedRoles.includes(decoded.role)) {
            return decoded;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function GET() {
    try {
        // Return dummy warehouses for demo
        const dummyWarehouses = [
            // Mumbai - 2 warehouses
            {
                _id: "wh-001",
                name: "Mumbai Central Warehouse",
                code: "WH-MUM-01",
                locationId: "loc-001",
                location: {
                    _id: "loc-001",
                    locationId: "MH-MUM-001",
                    city: "Mumbai",
                    state: "Maharashtra"
                },
                address: "Plot 45, Andheri Industrial Estate, Mumbai - 400001",
                capacity: 50000,
                currentUtilization: 35000,
                manager: "Rajesh Kumar",
                contact: "+91 98765 43210",
                status: "active",
                type: "Distribution Center",
                createdAt: new Date("2024-11-20"),
                updatedAt: new Date("2024-12-07")
            },
            {
                _id: "wh-007",
                name: "Mumbai Port Warehouse",
                code: "WH-MUM-02",
                locationId: "loc-001",
                location: {
                    _id: "loc-001",
                    locationId: "MH-MUM-001",
                    city: "Mumbai",
                    state: "Maharashtra"
                },
                address: "Dock Area, Mumbai Port Trust, Mumbai - 400037",
                capacity: 30000,
                currentUtilization: 18000,
                manager: "Priyanka Desai",
                contact: "+91 98765 43220",
                status: "inactive",
                type: "Port Warehouse",
                createdAt: new Date("2024-11-18"),
                updatedAt: new Date("2024-12-05")
            },
            // Delhi - 3 warehouses
            {
                _id: "wh-002",
                name: "Delhi Logistics Hub",
                code: "WH-DEL-01",
                locationId: "loc-002",
                location: {
                    _id: "loc-002",
                    locationId: "DL-DEL-001",
                    city: "New Delhi",
                    state: "Delhi"
                },
                address: "Sector 12, Okhla Industrial Area, New Delhi - 110001",
                capacity: 60000,
                currentUtilization: 42000,
                manager: "Priya Sharma",
                contact: "+91 98765 43211",
                status: "active",
                type: "Logistics Hub",
                createdAt: new Date("2024-11-22"),
                updatedAt: new Date("2024-12-06")
            },
            {
                _id: "wh-008",
                name: "Delhi North Warehouse",
                code: "WH-DEL-02",
                locationId: "loc-002",
                location: {
                    _id: "loc-002",
                    locationId: "DL-DEL-001",
                    city: "New Delhi",
                    state: "Delhi"
                },
                address: "Narela Industrial Area, New Delhi - 110040",
                capacity: 40000,
                currentUtilization: 25000,
                manager: "Sunil Verma",
                contact: "+91 98765 43221",
                status: "active",
                type: "Distribution Center",
                createdAt: new Date("2024-11-23"),
                updatedAt: new Date("2024-12-04")
            },
            {
                _id: "wh-009",
                name: "Delhi Cold Storage",
                code: "WH-DEL-03",
                locationId: "loc-002",
                location: {
                    _id: "loc-002",
                    locationId: "DL-DEL-001",
                    city: "New Delhi",
                    state: "Delhi"
                },
                address: "Mayapuri Industrial Area, New Delhi - 110064",
                capacity: 25000,
                currentUtilization: 20000,
                manager: "Amit Saxena",
                contact: "+91 98765 43222",
                status: "maintenance",
                type: "Cold Storage",
                createdAt: new Date("2024-11-21"),
                updatedAt: new Date("2024-12-02")
            },
            // Bangalore - 2 warehouses
            {
                _id: "wh-003",
                name: "Bangalore Tech Warehouse",
                code: "WH-BLR-01",
                locationId: "loc-003",
                location: {
                    _id: "loc-003",
                    locationId: "KA-BLR-001",
                    city: "Bangalore",
                    state: "Karnataka"
                },
                address: "Building 3, Whitefield Tech Park, Bangalore - 560001",
                capacity: 45000,
                currentUtilization: 28000,
                manager: "Amit Patel",
                contact: "+91 98765 43212",
                status: "maintenance",
                type: "Storage Facility",
                createdAt: new Date("2024-11-25"),
                updatedAt: new Date("2024-12-05")
            },
            {
                _id: "wh-010",
                name: "Bangalore Electronics Hub",
                code: "WH-BLR-02",
                locationId: "loc-003",
                location: {
                    _id: "loc-003",
                    locationId: "KA-BLR-001",
                    city: "Bangalore",
                    state: "Karnataka"
                },
                address: "Electronic City Phase 1, Bangalore - 560100",
                capacity: 35000,
                currentUtilization: 30000,
                manager: "Deepak Rao",
                contact: "+91 98765 43223",
                status: "active",
                type: "Electronics Hub",
                createdAt: new Date("2024-11-27"),
                updatedAt: new Date("2024-12-06")
            },
            // Chennai - 1 warehouse
            {
                _id: "wh-004",
                name: "Chennai Distribution Center",
                code: "WH-CHE-01",
                locationId: "loc-004",
                location: {
                    _id: "loc-004",
                    locationId: "TN-CHE-001",
                    city: "Chennai",
                    state: "Tamil Nadu"
                },
                address: "Zone 8, Ambattur Industrial Estate, Chennai - 600001",
                capacity: 40000,
                currentUtilization: 31000,
                manager: "Sneha Reddy",
                contact: "+91 98765 43213",
                status: "active",
                type: "Distribution Center",
                createdAt: new Date("2024-11-28"),
                updatedAt: new Date("2024-12-04")
            },
            // Ahmedabad - 2 warehouses
            {
                _id: "wh-005",
                name: "Ahmedabad Storage Facility",
                code: "WH-AHM-01",
                locationId: "loc-005",
                location: {
                    _id: "loc-005",
                    locationId: "GJ-AHM-001",
                    city: "Ahmedabad",
                    state: "Gujarat"
                },
                address: "Phase 2, Naroda Industrial Area, Ahmedabad - 380001",
                capacity: 35000,
                currentUtilization: 22000,
                manager: "Vikram Singh",
                contact: "+91 98765 43214",
                status: "inactive",
                type: "Storage Facility",
                createdAt: new Date("2024-12-01"),
                updatedAt: new Date("2024-12-07")
            },
            {
                _id: "wh-011",
                name: "Ahmedabad Textile Warehouse",
                code: "WH-AHM-02",
                locationId: "loc-005",
                location: {
                    _id: "loc-005",
                    locationId: "GJ-AHM-001",
                    city: "Ahmedabad",
                    state: "Gujarat"
                },
                address: "Vatva GIDC, Ahmedabad - 382445",
                capacity: 28000,
                currentUtilization: 15000,
                manager: "Ravi Mehta",
                contact: "+91 98765 43224",
                status: "active",
                type: "Textile Warehouse",
                createdAt: new Date("2024-11-30"),
                updatedAt: new Date("2024-12-03")
            },
            // Kolkata - 1 warehouse
            {
                _id: "wh-006",
                name: "Kolkata East Warehouse",
                code: "WH-KOL-01",
                locationId: "loc-006",
                location: {
                    _id: "loc-006",
                    locationId: "WB-KOL-001",
                    city: "Kolkata",
                    state: "West Bengal"
                },
                address: "Tower B, Salt Lake Sector V, Kolkata - 700001",
                capacity: 38000,
                currentUtilization: 25000,
                manager: "Arjun Mehta",
                contact: "+91 98765 43215",
                status: "inactive",
                type: "Warehouse",
                createdAt: new Date("2024-11-26"),
                updatedAt: new Date("2024-12-03")
            }
        ];

        return NextResponse.json(dummyWarehouses);
    } catch (error) {
        console.error("Error fetching warehouses:", error);
        return NextResponse.json(
            { message: "Failed to fetch warehouses" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        // Role Verification: Only 'manager' can create warehouses
        const user = await verifyRole(["manager"]);
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized: Only managers can create warehouses" },
                { status: 403 }
            );
        }

        const body = await request.json();
        await connectToDatabase();

        if (!body.warehouseId || !body.name) {
            return NextResponse.json(
                { message: "Warehouse ID and name are required" },
                { status: 400 }
            );
        }

        // Check if warehouseId already exists
        const existingWarehouse = await Warehouse.findOne({ warehouseId: body.warehouseId });
        if (existingWarehouse) {
            return NextResponse.json(
                { message: "Warehouse ID already exists" },
                { status: 400 }
            );
        }

        const warehouse = await Warehouse.create(body);

        return NextResponse.json(warehouse, { status: 201 });
    } catch (error) {
        console.error("Error creating warehouse:", error);
        return NextResponse.json(
            { message: "Failed to create warehouse" },
            { status: 500 }
        );
    }
}
