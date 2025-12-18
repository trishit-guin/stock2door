import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";

// GET - Fetch single internal move by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const internalMove = await Move.findOne({ _id: id, type: "internal" })
            .populate("items.productId", "name sku category uom")
            .populate("sourceLocation", "name type address")
            .populate("destinationLocation", "name type address");

        if (!internalMove) {
            return NextResponse.json(
                { message: "Internal move not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(internalMove);
    } catch (error) {
        console.error("Error fetching internal move:", error);
        return NextResponse.json(
            { message: "Failed to fetch internal move" },
            { status: 500 }
        );
    }
}
