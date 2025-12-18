import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Warehouse from "@/lib/models/Warehouse";
import Product from "@/lib/models/Product";

// GET - Fetch single warehouse by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const warehouse = await Warehouse.findById(id)
            .populate("locationId", "country state city");

        if (!warehouse) {
            return NextResponse.json(
                { message: "Warehouse not found" },
                { status: 404 }
            );
        }

        // Count products with stock in this warehouse
        const productsWithStock = await Product.countDocuments({
            "stockLevels.warehouseId": id,
            "stockLevels.quantity": { $gt: 0 }
        });

        return NextResponse.json({
            ...warehouse.toObject(),
            productCount: productsWithStock,
        });
    } catch (error) {
        console.error("Error fetching warehouse:", error);
        return NextResponse.json(
            { message: "Failed to fetch warehouse" },
            { status: 500 }
        );
    }
}

// PUT - Update warehouse details
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();

        const warehouse = await Warehouse.findById(id);
        if (!warehouse) {
            return NextResponse.json(
                { message: "Warehouse not found" },
                { status: 404 }
            );
        }

        // Validate required fields
        if (!body.locationId) {
            return NextResponse.json(
                { message: "Location is required" },
                { status: 400 }
            );
        }

        // Update fields (name cannot be changed)
        if (body.type) warehouse.type = body.type;
        if (body.address !== undefined) warehouse.address = body.address;
        warehouse.locationId = body.locationId;

        await warehouse.save();

        return NextResponse.json(warehouse);
    } catch (error) {
        console.error("Error updating warehouse:", error);
        return NextResponse.json(
            { message: "Failed to update warehouse" },
            { status: 500 }
        );
    }
}

// DELETE - Delete warehouse
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const warehouse = await Warehouse.findById(id);
        if (!warehouse) {
            return NextResponse.json(
                { message: "Warehouse not found" },
                { status: 404 }
            );
        }

        // Check if any products have stock in this warehouse
        const productsWithStock = await Product.countDocuments({
            stockLevels: {
                $elemMatch: {
                    warehouseId: id,
                    quantity: { $gt: 0 }
                }
            }
        });

        if (productsWithStock) {
            return NextResponse.json(
                { message: "Cannot delete warehouse with stock. Please move or adjust stock first." },
                { status: 400 }
            );
        }

        await Warehouse.findByIdAndDelete(id);

        return NextResponse.json({ message: "Warehouse deleted successfully" });
    } catch (error) {
        console.error("Error deleting warehouse:", error);
        return NextResponse.json(
            { message: "Failed to delete warehouse" },
            { status: 500 }
        );
    }
}
