import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/lib/models/Product";
import Move from "@/lib/models/Move";
import Warehouse from "@/lib/models/Warehouse";

export async function GET(request: Request) {
    try {
        // Return dummy dashboard stats for demo
        const dummyStats = {
            totalProducts: 10,
            totalStock: 8560,
            lowStockItems: 2,
            totalWarehouses: 6,
            pendingMoves: 8,
            totalMoves: 145,
            todayCompleted: 12,
            recentMoves: [
                {
                    _id: "move-001",
                    type: "receipt",
                    status: "done",
                    items: [
                        { productId: { _id: "prod-001", name: "Basmati Rice Premium", sku: "RICE-BAS-001" }, quantity: 500 }
                    ],
                    sourceLocation: { _id: "loc-001", name: "Mumbai Central Warehouse" },
                    destinationLocation: { _id: "loc-002", name: "Delhi Logistics Hub" },
                    createdAt: new Date("2024-12-07T10:30:00")
                },
                {
                    _id: "move-002",
                    type: "delivery",
                    status: "in_transit",
                    items: [
                        { productId: { _id: "prod-002", name: "Tata Tea Gold", sku: "TEA-TG-002" }, quantity: 200 }
                    ],
                    sourceLocation: { _id: "loc-003", name: "Bangalore Tech Warehouse" },
                    destinationLocation: null,
                    createdAt: new Date("2024-12-07T09:15:00")
                },
                {
                    _id: "move-003",
                    type: "internal_transfer",
                    status: "done",
                    items: [
                        { productId: { _id: "prod-003", name: "Amul Butter", sku: "DAIRY-AMB-003" }, quantity: 300 }
                    ],
                    sourceLocation: { _id: "loc-004", name: "Chennai Distribution Center" },
                    destinationLocation: { _id: "loc-005", name: "Ahmedabad Storage Facility" },
                    createdAt: new Date("2024-12-06T16:45:00")
                },
                {
                    _id: "move-004",
                    type: "adjustment",
                    status: "done",
                    items: [
                        { productId: { _id: "prod-006", name: "Maggi Noodles", sku: "FOOD-MN-006" }, quantity: -50 }
                    ],
                    sourceLocation: { _id: "loc-001", name: "Mumbai Central Warehouse" },
                    destinationLocation: null,
                    createdAt: new Date("2024-12-06T14:20:00")
                },
                {
                    _id: "move-005",
                    type: "receipt",
                    status: "draft",
                    items: [
                        { productId: { _id: "prod-008", name: "Colgate MaxFresh", sku: "PERS-CM-008" }, quantity: 400 }
                    ],
                    sourceLocation: null,
                    destinationLocation: { _id: "loc-006", name: "Kolkata East Warehouse" },
                    createdAt: new Date("2024-12-06T11:00:00")
                }
            ],
            stockByWarehouse: [
                { warehouseName: "Mumbai Central Warehouse", totalStock: 1850 },
                { warehouseName: "Delhi Logistics Hub", totalStock: 1620 },
                { warehouseName: "Bangalore Tech Warehouse", totalStock: 1450 },
                { warehouseName: "Chennai Distribution Center", totalStock: 1280 },
                { warehouseName: "Ahmedabad Storage Facility", totalStock: 1100 },
                { warehouseName: "Kolkata East Warehouse", totalStock: 1260 }
            ],
            recentActivities: [
                {
                    _id: "act-001",
                    type: "Stock Receipt",
                    description: "Received 500 kg of Basmati Rice at Mumbai warehouse",
                    user: "Rajesh Kumar",
                    timestamp: new Date("2024-12-07T10:30:00")
                },
                {
                    _id: "act-002",
                    type: "Delivery",
                    description: "Dispatched 200 kg of Tata Tea from Bangalore",
                    user: "Amit Patel",
                    timestamp: new Date("2024-12-07T09:15:00")
                },
                {
                    _id: "act-003",
                    type: "Internal Transfer",
                    description: "Transferred 300 packs of Amul Butter from Chennai to Ahmedabad",
                    user: "Sneha Reddy",
                    timestamp: new Date("2024-12-06T16:45:00")
                },
                {
                    _id: "act-004",
                    type: "Stock Adjustment",
                    description: "Adjusted Maggi Noodles stock (-50 cartons) due to damage",
                    user: "Vikram Singh",
                    timestamp: new Date("2024-12-06T14:20:00")
                },
                {
                    _id: "act-005",
                    type: "Low Stock Alert",
                    description: "Parle-G Biscuits below reorder level (450/100)",
                    user: "System",
                    timestamp: new Date("2024-12-06T12:00:00")
                }
            ],
            topProducts: [
                { productName: "Basmati Rice Premium", stockLevel: 2500, movements: 45 },
                { productName: "Amul Butter", stockLevel: 1200, movements: 38 },
                { productName: "Maggi Noodles", stockLevel: 950, movements: 52 },
                { productName: "Colgate MaxFresh", stockLevel: 890, movements: 31 },
                { productName: "Tata Tea Gold", stockLevel: 850, movements: 28 }
            ]
        };

        return NextResponse.json(dummyStats);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard statistics" },
            { status: 500 }
        );
    }
}
