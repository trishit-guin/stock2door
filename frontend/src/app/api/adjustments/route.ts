import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";

// GET - Fetch all adjustments
export async function GET(request: Request) {
    try {
        await connectToDatabase();

        const adjustments = await Move.find({ type: "adjustment" })
            .populate("items.productId", "name sku")
            .populate("destinationLocation", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json(adjustments);
    } catch (error) {
        console.error("Error fetching adjustments:", error);
        return NextResponse.json(
            { message: "Failed to fetch adjustments" },
            { status: 500 }
        );
    }
}

// POST - Create draft adjustment
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Validation
        if (!body.destinationLocation || !body.items || body.items.length === 0) {
            return NextResponse.json(
                { message: "Warehouse and items are required" },
                { status: 400 }
            );
        }

        const adjustment = await Move.create({
            type: "adjustment",
            sourceLocation: null, // Adjustments don't have a source
            destinationLocation: body.destinationLocation,
            items: body.items, // Items should include reason field
            status: "draft",
            notes: body.notes || "",
        });

        return NextResponse.json(adjustment, { status: 201 });
    } catch (error) {
        console.error("Error creating adjustment:", error);
        return NextResponse.json(
            { message: "Failed to create adjustment" },
            { status: 500 }
        );
    }
}

// PUT - Validate adjustment (update stock)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Adjustment ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const adjustment = await Move.findById(id);
        if (!adjustment) {
            return NextResponse.json(
                { message: "Adjustment not found" },
                { status: 404 }
            );
        }

        if (adjustment.status === "done") {
            return NextResponse.json(
                { message: "Adjustment already validated" },
                { status: 400 }
            );
        }

        // Validate and apply adjustments
        try {
            for (const item of adjustment.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                // Find or create stock level for warehouse
                let stockLevel = product.stockLevels.find(
                    (l: any) => l.warehouseId?.toString() === adjustment.destinationLocation?.toString()
                );

                if (stockLevel) {
                    // Apply adjustment (can be positive or negative)
                    stockLevel.quantity += item.quantity;

                    // Prevent negative stock
                    if (stockLevel.quantity < 0) {
                        throw new Error(
                            `Adjustment would result in negative stock for ${product.name}. Current: ${stockLevel.quantity - item.quantity}, Adjustment: ${item.quantity}`
                        );
                    }
                } else {
                    // If no stock level exists and adjustment is positive, create it
                    if (item.quantity > 0) {
                        product.stockLevels.push({
                            warehouseId: adjustment.destinationLocation,
                            quantity: item.quantity
                        });
                    } else {
                        throw new Error(
                            `Cannot apply negative adjustment for ${product.name} - no stock exists at this warehouse`
                        );
                    }
                }

                // Update total stock
                product.totalStock += item.quantity;

                // Prevent negative total stock
                if (product.totalStock < 0) {
                    throw new Error(
                        `Adjustment would result in negative total stock for ${product.name}`
                    );
                }

                await product.save();
            }

            // Update adjustment status
            adjustment.status = "done";
            await adjustment.save();

            return NextResponse.json(adjustment);
        } catch (error: any) {
            return NextResponse.json(
                { message: error.message || "Validation failed" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error validating adjustment:", error);
        return NextResponse.json(
            { message: "Failed to validate adjustment" },
            { status: 500 }
        );
    }
}
