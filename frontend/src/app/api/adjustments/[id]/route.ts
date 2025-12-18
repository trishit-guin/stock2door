import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";

// GET - Fetch single adjustment by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const adjustment = await Move.findOne({ _id: id, type: "adjustment" })
            .populate("items.productId", "name sku category uom")
            .populate("destinationLocation", "name type address")
            .populate("createdBy", "firstName lastName email");

        if (!adjustment) {
            return NextResponse.json(
                { message: "Adjustment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(adjustment);
    } catch (error) {
        console.error("Error fetching adjustment:", error);
        return NextResponse.json(
            { message: "Failed to fetch adjustment" },
            { status: 500 }
        );
    }
}
