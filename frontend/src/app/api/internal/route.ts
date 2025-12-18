import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";

// GET - Fetch all internal transfers (warehouse to warehouse)
export async function GET(request: Request) {
    try {
        await connectToDatabase();

        const internalMoves = await Move.find({ type: "internal" })
            .populate("items.productId", "name sku")
            .populate("sourceLocation", "name")
            .populate("destinationLocation", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json(internalMoves);
    } catch (error) {
        console.error("Error fetching internal moves:", error);
        return NextResponse.json(
            { message: "Failed to fetch internal moves" },
            { status: 500 }
        );
    }
}

// POST - Create draft internal transfer (warehouse to warehouse)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Validation
        if (!body.sourceLocation || !body.destinationLocation || !body.items || body.items.length === 0) {
            return NextResponse.json(
                { message: "Source warehouse, destination warehouse, and items are required" },
                { status: 400 }
            );
        }

        if (body.sourceLocation === body.destinationLocation) {
            return NextResponse.json(
                { message: "Source and destination warehouses must be different" },
                { status: 400 }
            );
        }

        const internalMove = await Move.create({
            type: "internal",
            sourceLocation: body.sourceLocation,
            destinationLocation: body.destinationLocation,
            items: body.items,
            status: "draft",
        });

        return NextResponse.json(internalMove, { status: 201 });
    } catch (error) {
        console.error("Error creating internal move:", error);
        return NextResponse.json(
            { message: "Failed to create internal move" },
            { status: 500 }
        );
    }
}

// PUT - Validate internal transfer (move stock between warehouses)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Internal move ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const internalMove = await Move.findById(id);
        if (!internalMove) {
            return NextResponse.json(
                { message: "Internal move not found" },
                { status: 404 }
            );
        }

        if (internalMove.status === "done") {
            return NextResponse.json(
                { message: "Internal move already validated" },
                { status: 400 }
            );
        }

        // Validate and move stock between warehouses
        try {
            for (const item of internalMove.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                // Find stock level for source warehouse
                const sourceLevel = product.stockLevels.find(
                    (l: any) => l.warehouseId?.toString() === internalMove.sourceLocation?.toString()
                );

                if (!sourceLevel || sourceLevel.quantity < item.quantity) {
                    throw new Error(
                        `Insufficient stock for ${product.name} at source warehouse. Available: ${sourceLevel?.quantity || 0}, Required: ${item.quantity}`
                    );
                }

                // Decrease stock at source
                sourceLevel.quantity -= item.quantity;

                // Find or create stock level for destination warehouse
                let destLevel = product.stockLevels.find(
                    (l: any) => l.warehouseId?.toString() === internalMove.destinationLocation?.toString()
                );

                if (destLevel) {
                    destLevel.quantity += item.quantity;
                } else {
                    product.stockLevels.push({
                        warehouseId: internalMove.destinationLocation,
                        quantity: item.quantity
                    });
                }

                // Total stock remains the same (just moved between warehouses)
                await product.save();
            }

            // Update internal move status
            internalMove.status = "done";
            await internalMove.save();

            return NextResponse.json(internalMove);
        } catch (error: any) {
            return NextResponse.json(
                { message: error.message || "Validation failed" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error validating internal move:", error);
        return NextResponse.json(
            { message: "Failed to validate internal move" },
            { status: 500 }
        );
    }
}
