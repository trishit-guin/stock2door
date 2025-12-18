import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";

// GET - Fetch single move by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const move = await Move.findById(id)
            .populate("items.productId", "name sku category uom")
            .populate("sourceLocation", "name type address")
            .populate("destinationLocation", "name type address")
            .populate("createdBy", "firstName lastName email");

        if (!move) {
            return NextResponse.json(
                { message: "Move not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(move);
    } catch (error) {
        console.error("Error fetching move:", error);
        return NextResponse.json(
            { message: "Failed to fetch move" },
            { status: 500 }
        );
    }
}
