import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/lib/models/Product";

// GET - Fetch single product by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const product = await Product.findById(id)
            .populate("stockLevels.warehouseId", "name type address");

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { message: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

// PUT - Update product details
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // Check SKU uniqueness if being changed
        if (body.sku && body.sku !== product.sku) {
            const existingProduct = await Product.findOne({ sku: body.sku });
            if (existingProduct) {
                return NextResponse.json(
                    { message: "SKU already exists" },
                    { status: 400 }
                );
            }
        }

        // Update allowed fields (not stock - that's via operations)
        if (body.name) product.name = body.name;
        if (body.sku) product.sku = body.sku;
        if (body.category !== undefined) product.category = body.category;
        if (body.uom !== undefined) product.uom = body.uom;
        if (body.minStock !== undefined) product.minStock = body.minStock;

        await product.save();

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { message: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE - Delete product
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // Check if product has any stock
        if (product.totalStock > 0) {
            return NextResponse.json(
                { message: `Cannot delete product with ${product.totalStock} units in stock` },
                { status: 400 }
            );
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { message: "Failed to delete product" },
            { status: 500 }
        );
    }
}
