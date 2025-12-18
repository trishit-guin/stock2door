import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Location from "@/lib/models/Location";
import Warehouse from "@/lib/models/Warehouse";

// GET - Fetch single location
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const location = await Location.findById(id);

        if (!location) {
            return NextResponse.json(
                { message: "Location not found" },
                { status: 404 }
            );
        }

        // Count warehouses at this location
        const warehouseCount = await Warehouse.countDocuments({ locationId: id });

        return NextResponse.json({
            ...location.toObject(),
            warehouseCount: warehouseCount,
        });
    } catch (error) {
        console.error("Error fetching location:", error);
        return NextResponse.json(
            { message: "Failed to fetch location" },
            { status: 500 }
        );
    }
}

// PUT - Update location
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();

        const location = await Location.findById(id);
        if (!location) {
            return NextResponse.json(
                { message: "Location not found" },
                { status: 404 }
            );
        }

        // Validate required fields
        if (!body.state || !body.city) {
            return NextResponse.json(
                { message: "State and City are required" },
                { status: 400 }
            );
        }

        // Check if the new combination already exists (excluding current location)
        const existingLocation = await Location.findOne({
            country: location.country, // Country cannot be changed
            state: body.state,
            city: body.city,
            _id: { $ne: id },
        });

        if (existingLocation) {
            return NextResponse.json(
                { message: "Location with this Country, State, and City combination already exists" },
                { status: 400 }
            );
        }

        // Update fields (country cannot be changed)
        location.state = body.state;
        location.city = body.city;
        if (body.isActive !== undefined) location.isActive = body.isActive;

        await location.save();

        return NextResponse.json(location);
    } catch (error) {
        console.error("Error updating location:", error);
        return NextResponse.json(
            { message: "Failed to update location" },
            { status: 500 }
        );
    }
}

// DELETE - Delete location
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const location = await Location.findById(id);
        if (!location) {
            return NextResponse.json(
                { message: "Location not found" },
                { status: 404 }
            );
        }

        // Check if location has warehouses
        const warehouseCount = await Warehouse.countDocuments({ locationId: id });
        if (warehouseCount > 0) {
            return NextResponse.json(
                { message: `Cannot delete location with ${warehouseCount} warehouse(s)` },
                { status: 400 }
            );
        }

        await Location.findByIdAndDelete(id);

        return NextResponse.json({ message: "Location deleted successfully" });
    } catch (error) {
        console.error("Error deleting location:", error);
        return NextResponse.json(
            { message: "Failed to delete location" },
            { status: 500 }
        );
    }
}
