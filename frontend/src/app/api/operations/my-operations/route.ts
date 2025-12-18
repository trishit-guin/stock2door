import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";

export async function GET() {
    try {
        await connectToDatabase();

        // Fetch recent operations (all types) - real data from database
        const operations = await Move.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("sourceLocation", "name")
            .populate("destinationLocation", "name")
            .select("type status items createdAt sourceLocation destinationLocation");

        const operationsWithCount = operations.map((op: any) => ({
            _id: op._id.toString(),
            type: op.type,
            status: op.status,
            itemCount: op.items?.length || 0,
            createdAt: op.createdAt,
            sourceLocation: op.sourceLocation?.name || null,
            destinationLocation: op.destinationLocation?.name || null,
        }));

        return NextResponse.json({ operations: operationsWithCount });
    } catch (error) {
        console.error("Error fetching operations:", error);
        return NextResponse.json(
            { message: "Failed to fetch operations" },
            { status: 500 }
        );
    }
}
