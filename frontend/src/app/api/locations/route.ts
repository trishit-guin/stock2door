import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Location from "@/lib/models/Location";
import Warehouse from "@/lib/models/Warehouse";

// GET - Fetch all locations
export async function GET(request: Request) {
    try {
        // Return dummy Indian locations for demo
        const dummyLocations = [
            {
                _id: "loc-001",
                locationId: "MH-MUM-001",
                country: "India",
                state: "Maharashtra",
                city: "Mumbai",
                pincode: "400001",
                address: "Andheri Industrial Estate",
                isActive: true,
                createdAt: new Date("2024-11-20"),
                updatedAt: new Date("2024-12-07")
            },
            {
                _id: "loc-002",
                locationId: "DL-DEL-001",
                country: "India",
                state: "Delhi",
                city: "New Delhi",
                pincode: "110001",
                address: "Okhla Industrial Area",
                isActive: true,
                createdAt: new Date("2024-11-22"),
                updatedAt: new Date("2024-12-06")
            },
            {
                _id: "loc-003",
                locationId: "KA-BLR-001",
                country: "India",
                state: "Karnataka",
                city: "Bangalore",
                pincode: "560001",
                address: "Whitefield Tech Park",
                isActive: true,
                createdAt: new Date("2024-11-25"),
                updatedAt: new Date("2024-12-05")
            },
            {
                _id: "loc-004",
                locationId: "TN-CHE-001",
                country: "India",
                state: "Tamil Nadu",
                city: "Chennai",
                pincode: "600001",
                address: "Ambattur Industrial Estate",
                isActive: true,
                createdAt: new Date("2024-11-28"),
                updatedAt: new Date("2024-12-04")
            },
            {
                _id: "loc-005",
                locationId: "GJ-AHM-001",
                country: "India",
                state: "Gujarat",
                city: "Ahmedabad",
                pincode: "380001",
                address: "Naroda Industrial Area",
                isActive: true,
                createdAt: new Date("2024-12-01"),
                updatedAt: new Date("2024-12-07")
            },
            {
                _id: "loc-006",
                locationId: "WB-KOL-001",
                country: "India",
                state: "West Bengal",
                city: "Kolkata",
                pincode: "700001",
                address: "Salt Lake Sector V",
                isActive: true,
                createdAt: new Date("2024-11-26"),
                updatedAt: new Date("2024-12-03")
            }
        ];

        return NextResponse.json(dummyLocations);
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json(
            { message: "Failed to fetch locations" },
            { status: 500 }
        );
    }
}

// POST - Create new location
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Validation
        if (!body.locationId || !body.country || !body.state || !body.city) {
            return NextResponse.json(
                { message: "Location ID, country, state, and city are required" },
                { status: 400 }
            );
        }

        // Check if locationId already exists
        const existingId = await Location.findOne({ locationId: body.locationId });
        if (existingId) {
            return NextResponse.json(
                { message: "Location ID already exists" },
                { status: 400 }
            );
        }

        // Check if location already exists
        const existingLocation = await Location.findOne({
            country: body.country,
            state: body.state,
            city: body.city
        });
        if (existingLocation) {
            return NextResponse.json(
                { message: "Location with this country-state-city combination already exists" },
                { status: 400 }
            );
        }

        const location = await Location.create({
            locationId: body.locationId,
            country: body.country,
            state: body.state,
            city: body.city,
            isActive: body.isActive !== undefined ? body.isActive : true,
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        console.error("Error creating location:", error);
        return NextResponse.json(
            { message: "Failed to create location" },
            { status: 500 }
        );
    }
}
