import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Location from "@/lib/models/Location";

// GET - Fetch child locations of a parent location
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();

        // Verify parent location exists
        const parentLocation = await Location.findById(params.id);
        if (!parentLocation) {
            return NextResponse.json(
                { message: "Parent location not found" },
                { status: 404 }
            );
        }

        // Fetch child locations
        const childLocations = await Location.find({ parentLocationId: id })
            .sort({ name: 1 });

        return NextResponse.json(childLocations);
    } catch (error) {
        console.error("Error fetching child locations:", error);
        return NextResponse.json(
            { message: "Failed to fetch child locations" },
            { status: 500 }
        );
    }
}
