import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Location from "@/lib/models/Location";
import Warehouse from "@/lib/models/Warehouse";

// GET - Fetch warehouses in a specific location
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();

        // Verify location exists
        const location = await Location.findById(params.id);
        if (!location) {
            return NextResponse.json(
                { message: "Location not found" },
                { status: 404 }
            );
        }

        // Fetch all warehouses at this location
        const warehouses = await Warehouse.find({ locationId: id })
            .populate("locationId", "name code type")
            .sort({ name: 1 });

        return NextResponse.json(warehouses);
    } catch (error) {
        console.error("Error fetching warehouses:", error);
        return NextResponse.json(
            { message: "Failed to fetch warehouses" },
            { status: 500 }
        );
    }
}
