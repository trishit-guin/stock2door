import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";

// GET - Fetch all deliveries
export async function GET(request: Request) {
    try {
        // Return dummy deliveries for demo
        const dummyDeliveries = [
            {
                _id: "del-001",
                type: "delivery",
                status: "in_transit",
                items: [
                    { productId: { _id: "prod-002", name: "Tata Tea Gold", sku: "TEA-TG-002" }, quantity: 200 }
                ],
                sourceLocation: { _id: "wh-003", name: "Bangalore Tech Warehouse" },
                customerName: "BigBasket Bangalore",
                customerAddress: "BTM Layout, Bangalore - 560076",
                notes: "Deliver by 5 PM today",
                createdAt: new Date("2024-12-07T09:15:00")
            },
            {
                _id: "del-002",
                type: "delivery",
                status: "done",
                items: [
                    { productId: { _id: "prod-004", name: "Parle-G Biscuits", sku: "SNACK-PG-004" }, quantity: 150 }
                ],
                sourceLocation: { _id: "wh-001", name: "Mumbai Central Warehouse" },
                customerName: "DMart Mumbai",
                customerAddress: "Andheri West, Mumbai - 400053",
                notes: "Delivered successfully",
                createdAt: new Date("2024-12-06T08:00:00")
            },
            {
                _id: "del-003",
                type: "delivery",
                status: "draft",
                items: [
                    { productId: { _id: "prod-009", name: "Britannia Marie Gold", sku: "SNACK-BMG-009" }, quantity: 80 }
                ],
                sourceLocation: { _id: "wh-005", name: "Ahmedabad Storage Facility" },
                customerName: "Reliance Fresh Ahmedabad",
                customerAddress: "Satellite Road, Ahmedabad - 380015",
                notes: "Prepare for dispatch",
                createdAt: new Date("2024-12-07T06:00:00")
            },
            {
                _id: "del-004",
                type: "delivery",
                status: "done",
                items: [
                    { productId: { _id: "prod-001", name: "Basmati Rice Premium", sku: "RICE-BAS-001" }, quantity: 300 }
                ],
                sourceLocation: { _id: "wh-002", name: "Delhi Logistics Hub" },
                customerName: "Spencer's Retail Delhi",
                customerAddress: "Connaught Place, New Delhi - 110001",
                notes: "Completed delivery",
                createdAt: new Date("2024-12-05T14:00:00")
            }
        ];

        return NextResponse.json(dummyDeliveries);
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        return NextResponse.json(
            { message: "Failed to fetch deliveries" },
            { status: 500 }
        );
    }
}

// POST - Create draft delivery
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Validation
        if (!body.sourceLocation || !body.items || body.items.length === 0) {
            return NextResponse.json(
                { message: "Source warehouse and items are required" },
                { status: 400 }
            );
        }

        const delivery = await Move.create({
            type: "delivery",
            sourceLocation: body.sourceLocation,
            destinationLocation: null, // Deliveries go to customers, not warehouses
            items: body.items,
            status: "draft",
        });

        return NextResponse.json(delivery, { status: 201 });
    } catch (error) {
        console.error("Error creating delivery:", error);
        return NextResponse.json(
            { message: "Failed to create delivery" },
            { status: 500 }
        );
    }
}

// PUT - Validate delivery (update stock)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Delivery ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const delivery = await Move.findById(id);
        if (!delivery) {
            return NextResponse.json(
                { message: "Delivery not found" },
                { status: 404 }
            );
        }

        if (delivery.status === "done") {
            return NextResponse.json(
                { message: "Delivery already validated" },
                { status: 400 }
            );
        }

        // Validate and update stock
        try {
            for (const item of delivery.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                // Find stock level for source warehouse
                const stockLevel = product.stockLevels.find(
                    (l: any) => l.warehouseId?.toString() === delivery.sourceLocation?.toString()
                );

                if (!stockLevel || stockLevel.quantity < item.quantity) {
                    throw new Error(
                        `Insufficient stock for ${product.name}. Available: ${stockLevel?.quantity || 0}, Required: ${item.quantity}`
                    );
                }

                // Decrease stock at source warehouse
                stockLevel.quantity -= item.quantity;
                product.totalStock -= item.quantity;

                await product.save();
            }

            // Update delivery status
            delivery.status = "done";
            await delivery.save();

            return NextResponse.json(delivery);
        } catch (error: any) {
            return NextResponse.json(
                { message: error.message || "Validation failed" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error validating delivery:", error);
        return NextResponse.json(
            { message: "Failed to validate delivery" },
            { status: 500 }
        );
    }
}
