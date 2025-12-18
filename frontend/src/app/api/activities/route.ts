import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";
import User from "@/lib/models/User";

export async function GET(request: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");

        // Fetch recent moves
        const moves = await Move.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("sourceLocation", "name")
            .populate("destinationLocation", "name")
            .lean();

        // Format activities
        const activities = moves.map((move: any) => {
            let details = "";
            const userName = "System"; // Default since we don't track createdBy yet

            switch (move.type) {
                case "receipt":
                    details = `Created receipt for ${move.destinationLocation?.name || "warehouse"}`;
                    break;
                case "delivery":
                    details = `Created delivery from ${move.sourceLocation?.name || "warehouse"}`;
                    break;
                case "internal":
                    details = `Transferred stock from ${move.sourceLocation?.name || "N/A"} to ${move.destinationLocation?.name || "N/A"}`;
                    break;
                case "adjustment":
                    details = `Adjusted stock at ${move.destinationLocation?.name || "warehouse"}`;
                    break;
                default:
                    details = `Created ${move.type} operation`;
            }

            if (move.status === "done") {
                details += " (Completed)";
            }

            return {
                _id: move._id.toString(),
                type: move.type,
                action: move.status,
                userName,
                details,
                timestamp: move.createdAt,
                status: move.status
            };
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json(
            { message: "Failed to fetch activities" },
            { status: 500 }
        );
    }
}
