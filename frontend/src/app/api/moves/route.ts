import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Move from "@/lib/models/Move";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        // Return dummy moves data for demo
        const dummyMoves = [
            {
                _id: "move-001",
                type: "receipt",
                status: "done",
                items: [
                    { productId: { _id: "prod-001", name: "Basmati Rice Premium", sku: "RICE-BAS-001" }, quantity: 500 }
                ],
                sourceLocation: null,
                destinationLocation: { _id: "wh-001", name: "Mumbai Central Warehouse" },
                notes: "Fresh stock from Punjab supplier",
                createdAt: new Date("2024-12-07T10:30:00"),
                updatedAt: new Date("2024-12-07T11:00:00")
            },
            {
                _id: "move-002",
                type: "delivery",
                status: "in_transit",
                items: [
                    { productId: { _id: "prod-002", name: "Tata Tea Gold", sku: "TEA-TG-002" }, quantity: 200 }
                ],
                sourceLocation: { _id: "wh-003", name: "Bangalore Tech Warehouse" },
                destinationLocation: null,
                customerName: "BigBasket Bangalore",
                customerAddress: "BTM Layout, Bangalore - 560076",
                notes: "Deliver by 5 PM today",
                createdAt: new Date("2024-12-07T09:15:00"),
                updatedAt: new Date("2024-12-07T09:30:00")
            },
            {
                _id: "move-003",
                type: "internal_transfer",
                status: "done",
                items: [
                    { productId: { _id: "prod-003", name: "Amul Butter", sku: "DAIRY-AMB-003" }, quantity: 300 }
                ],
                sourceLocation: { _id: "wh-004", name: "Chennai Distribution Center" },
                destinationLocation: { _id: "wh-005", name: "Ahmedabad Storage Facility" },
                notes: "Stock rebalancing",
                createdAt: new Date("2024-12-06T16:45:00"),
                updatedAt: new Date("2024-12-06T18:00:00")
            },
            {
                _id: "move-004",
                type: "adjustment",
                status: "done",
                items: [
                    { productId: { _id: "prod-006", name: "Maggi Noodles", sku: "FOOD-MN-006" }, quantity: -50 }
                ],
                sourceLocation: { _id: "wh-001", name: "Mumbai Central Warehouse" },
                destinationLocation: null,
                reason: "damaged",
                notes: "Water damage during storage",
                createdAt: new Date("2024-12-06T14:20:00"),
                updatedAt: new Date("2024-12-06T14:30:00")
            },
            {
                _id: "move-005",
                type: "receipt",
                status: "draft",
                items: [
                    { productId: { _id: "prod-008", name: "Colgate MaxFresh", sku: "PERS-CM-008" }, quantity: 400 }
                ],
                sourceLocation: null,
                destinationLocation: { _id: "wh-006", name: "Kolkata East Warehouse" },
                notes: "New shipment from Colgate",
                createdAt: new Date("2024-12-06T11:00:00"),
                updatedAt: new Date("2024-12-06T11:00:00")
            },
            {
                _id: "move-006",
                type: "delivery",
                status: "done",
                items: [
                    { productId: { _id: "prod-004", name: "Parle-G Biscuits", sku: "SNACK-PG-004" }, quantity: 150 }
                ],
                sourceLocation: { _id: "wh-001", name: "Mumbai Central Warehouse" },
                destinationLocation: null,
                customerName: "DMart Mumbai",
                customerAddress: "Andheri West, Mumbai - 400053",
                notes: "Delivered successfully",
                createdAt: new Date("2024-12-06T08:00:00"),
                updatedAt: new Date("2024-12-06T12:00:00")
            },
            {
                _id: "move-007",
                type: "internal_transfer",
                status: "in_transit",
                items: [
                    { productId: { _id: "prod-005", name: "Fortune Sunflower Oil", sku: "OIL-FSO-005" }, quantity: 100 }
                ],
                sourceLocation: { _id: "wh-002", name: "Delhi Logistics Hub" },
                destinationLocation: { _id: "wh-003", name: "Bangalore Tech Warehouse" },
                notes: "Urgent transfer for Bangalore demand",
                createdAt: new Date("2024-12-07T07:00:00"),
                updatedAt: new Date("2024-12-07T07:15:00")
            },
            {
                _id: "move-008",
                type: "receipt",
                status: "pending",
                items: [
                    { productId: { _id: "prod-007", name: "Surf Excel Detergent", sku: "HOME-SE-007" }, quantity: 200 }
                ],
                sourceLocation: null,
                destinationLocation: { _id: "wh-002", name: "Delhi Logistics Hub" },
                notes: "Awaiting truck arrival",
                createdAt: new Date("2024-12-06T15:00:00"),
                updatedAt: new Date("2024-12-06T15:00:00")
            },
            {
                _id: "move-009",
                type: "delivery",
                status: "draft",
                items: [
                    { productId: { _id: "prod-009", name: "Britannia Marie Gold", sku: "SNACK-BMG-009" }, quantity: 80 }
                ],
                sourceLocation: { _id: "wh-005", name: "Ahmedabad Storage Facility" },
                destinationLocation: null,
                customerName: "Reliance Fresh Ahmedabad",
                customerAddress: "Satellite Road, Ahmedabad - 380015",
                notes: "Prepare for dispatch",
                createdAt: new Date("2024-12-07T06:00:00"),
                updatedAt: new Date("2024-12-07T06:00:00")
            },
            {
                _id: "move-010",
                type: "adjustment",
                status: "done",
                items: [
                    { productId: { _id: "prod-010", name: "Himalaya Face Wash", sku: "PERS-HFW-010" }, quantity: 25 }
                ],
                sourceLocation: { _id: "wh-004", name: "Chennai Distribution Center" },
                destinationLocation: null,
                reason: "found",
                notes: "Stock count correction - found additional units",
                createdAt: new Date("2024-12-05T13:00:00"),
                updatedAt: new Date("2024-12-05T13:15:00")
            }
        ];

        // Filter by type if specified
        const filteredMoves = type 
            ? dummyMoves.filter(move => move.type === type)
            : dummyMoves;

        return NextResponse.json(filteredMoves);
    } catch (error) {
        console.error("Error fetching moves:", error);
        return NextResponse.json(
            { message: "Failed to fetch moves" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Basic validation
        if (!body.type || !body.items || body.items.length === 0) {
            return NextResponse.json(
                { message: "Type and items are required" },
                { status: 400 }
            );
        }

        const move = await Move.create({
            ...body,
            status: "draft", // Always start as draft
        });

        return NextResponse.json(move, { status: 201 });
    } catch (error) {
        console.error("Error creating move:", error);
        return NextResponse.json(
            { message: "Failed to create move" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { message: "ID and status are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const move = await Move.findById(id);
        if (!move) {
            return NextResponse.json(
                { message: "Move not found" },
                { status: 404 }
            );
        }

        // If moving to "done", validate stock
        if (status === "done" && move.status !== "done") {
            try {
                for (const item of move.items) {
                    const product = await Product.findById(item.productId);
                    if (!product) throw new Error(`Product ${item.productId} not found`);

                    // Logic based on move type
                    if (move.type === "receipt") {
                        // Increase stock at destination
                        let level = product.stockLevels.find((l: any) => l.warehouseId?.toString() === move.destinationLocation?.toString());
                        if (level) {
                            level.quantity += item.quantity;
                        } else {
                            product.stockLevels.push({ warehouseId: move.destinationLocation, quantity: item.quantity });
                        }
                        product.totalStock += item.quantity;
                    } else if (move.type === "delivery") {
                        // Decrease stock at source
                        let level = product.stockLevels.find((l: any) => l.warehouseId?.toString() === move.sourceLocation?.toString());
                        if (!level || level.quantity < item.quantity) {
                            throw new Error(`Insufficient stock for product ${product.name}`);
                        }
                        level.quantity -= item.quantity;
                        product.totalStock -= item.quantity;
                    }

                    await product.save();
                }

                move.status = "done";
                await move.save();
            } catch (error: any) {
                return NextResponse.json(
                    { message: error.message || "Validation failed" },
                    { status: 400 }
                );
            }
        } else {
            // Just update status if not validating
            move.status = status;
            await move.save();
        }

        return NextResponse.json(move);
    } catch (error) {
        console.error("Error updating move:", error);
        return NextResponse.json(
            { message: "Failed to update move" },
            { status: 500 }
        );
    }
}
