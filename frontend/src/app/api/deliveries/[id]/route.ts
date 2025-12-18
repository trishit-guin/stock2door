import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";

// GET - Fetch single delivery by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const delivery = await Move.findOne({ _id: id, type: "delivery" })
            .populate("items.productId", "name sku category uom")
            .populate("sourceLocation", "name type address");

        if (!delivery) {
            return NextResponse.json(
                { message: "Delivery not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(delivery);
    } catch (error) {
        console.error("Error fetching delivery:", error);
        return NextResponse.json(
            { message: "Failed to fetch delivery" },
            { status: 500 }
        );
    }
}
