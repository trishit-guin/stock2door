import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/lib/models/Product";

// GET - Fetch stock overview
export async function GET(request: Request) {
    try {
        // Return dummy stock data for demo
        const dummyStockData = [
            {
                _id: "prod-001",
                name: "Basmati Rice Premium",
                sku: "RICE-BAS-001",
                category: "Food & Grains",
                totalStock: 2500,
                minStock: 500,
                reorderLevel: 500,
                unit: "kg",
                stockLevels: [
                    { warehouseId: { _id: "wh-001", name: "Mumbai Central Warehouse" }, quantity: 800, lastUpdated: new Date("2024-12-07") },
                    { warehouseId: { _id: "wh-002", name: "Delhi Logistics Hub" }, quantity: 600, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-003", name: "Bangalore Tech Warehouse" }, quantity: 550, lastUpdated: new Date("2024-12-05") },
                    { warehouseId: { _id: "wh-005", name: "Ahmedabad Storage Facility" }, quantity: 550, lastUpdated: new Date("2024-12-04") }
                ]
            },
            {
                _id: "prod-002",
                name: "Tata Tea Gold",
                sku: "TEA-TG-002",
                category: "Beverages",
                totalStock: 850,
                minStock: 200,
                reorderLevel: 200,
                unit: "kg",
                stockLevels: [
                    { warehouseId: { _id: "wh-003", name: "Bangalore Tech Warehouse" }, quantity: 350, lastUpdated: new Date("2024-12-07") },
                    { warehouseId: { _id: "wh-004", name: "Chennai Distribution Center" }, quantity: 280, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-006", name: "Kolkata East Warehouse" }, quantity: 220, lastUpdated: new Date("2024-12-05") }
                ]
            },
            {
                _id: "prod-003",
                name: "Amul Butter",
                sku: "DAIRY-AMB-003",
                category: "Dairy Products",
                totalStock: 1200,
                minStock: 300,
                reorderLevel: 300,
                unit: "pack",
                stockLevels: [
                    { warehouseId: { _id: "wh-001", name: "Mumbai Central Warehouse" }, quantity: 400, lastUpdated: new Date("2024-12-07") },
                    { warehouseId: { _id: "wh-002", name: "Delhi Logistics Hub" }, quantity: 350, lastUpdated: new Date("2024-12-07") },
                    { warehouseId: { _id: "wh-004", name: "Chennai Distribution Center" }, quantity: 250, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-005", name: "Ahmedabad Storage Facility" }, quantity: 200, lastUpdated: new Date("2024-12-05") }
                ]
            },
            {
                _id: "prod-004",
                name: "Parle-G Biscuits",
                sku: "SNACK-PG-004",
                category: "Snacks",
                totalStock: 450,
                minStock: 500,
                reorderLevel: 500,
                unit: "carton",
                stockLevels: [
                    { warehouseId: { _id: "wh-001", name: "Mumbai Central Warehouse" }, quantity: 180, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-003", name: "Bangalore Tech Warehouse" }, quantity: 150, lastUpdated: new Date("2024-12-05") },
                    { warehouseId: { _id: "wh-006", name: "Kolkata East Warehouse" }, quantity: 120, lastUpdated: new Date("2024-12-04") }
                ],
                lowStock: true
            },
            {
                _id: "prod-005",
                name: "Fortune Sunflower Oil",
                sku: "OIL-FSO-005",
                category: "Cooking Oil",
                totalStock: 680,
                minStock: 150,
                reorderLevel: 150,
                unit: "liter",
                stockLevels: [
                    { warehouseId: { _id: "wh-002", name: "Delhi Logistics Hub" }, quantity: 250, lastUpdated: new Date("2024-12-07") },
                    { warehouseId: { _id: "wh-004", name: "Chennai Distribution Center" }, quantity: 230, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-005", name: "Ahmedabad Storage Facility" }, quantity: 200, lastUpdated: new Date("2024-12-05") }
                ]
            },
            {
                _id: "prod-006",
                name: "Maggi Noodles",
                sku: "FOOD-MN-006",
                category: "Instant Food",
                totalStock: 950,
                minStock: 200,
                reorderLevel: 200,
                unit: "carton",
                stockLevels: [
                    { warehouseId: { _id: "wh-001", name: "Mumbai Central Warehouse" }, quantity: 300, lastUpdated: new Date("2024-12-07") },
                    { warehouseId: { _id: "wh-002", name: "Delhi Logistics Hub" }, quantity: 280, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-003", name: "Bangalore Tech Warehouse" }, quantity: 220, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-006", name: "Kolkata East Warehouse" }, quantity: 150, lastUpdated: new Date("2024-12-05") }
                ]
            },
            {
                _id: "prod-007",
                name: "Surf Excel Detergent",
                sku: "HOME-SE-007",
                category: "Home Care",
                totalStock: 420,
                minStock: 500,
                reorderLevel: 500,
                unit: "kg",
                stockLevels: [
                    { warehouseId: { _id: "wh-001", name: "Mumbai Central Warehouse" }, quantity: 150, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-003", name: "Bangalore Tech Warehouse" }, quantity: 140, lastUpdated: new Date("2024-12-05") },
                    { warehouseId: { _id: "wh-004", name: "Chennai Distribution Center" }, quantity: 130, lastUpdated: new Date("2024-12-04") }
                ],
                lowStock: true
            },
            {
                _id: "prod-008",
                name: "Colgate MaxFresh",
                sku: "PERS-CM-008",
                category: "Personal Care",
                totalStock: 890,
                minStock: 250,
                reorderLevel: 250,
                unit: "piece",
                stockLevels: [
                    { warehouseId: { _id: "wh-002", name: "Delhi Logistics Hub" }, quantity: 320, lastUpdated: new Date("2024-12-07") },
                    { warehouseId: { _id: "wh-004", name: "Chennai Distribution Center" }, quantity: 290, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-006", name: "Kolkata East Warehouse" }, quantity: 280, lastUpdated: new Date("2024-12-05") }
                ]
            },
            {
                _id: "prod-009",
                name: "Britannia Marie Gold",
                sku: "SNACK-BMG-009",
                category: "Snacks",
                totalStock: 520,
                minStock: 120,
                reorderLevel: 120,
                unit: "carton",
                stockLevels: [
                    { warehouseId: { _id: "wh-001", name: "Mumbai Central Warehouse" }, quantity: 180, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-003", name: "Bangalore Tech Warehouse" }, quantity: 170, lastUpdated: new Date("2024-12-05") },
                    { warehouseId: { _id: "wh-005", name: "Ahmedabad Storage Facility" }, quantity: 170, lastUpdated: new Date("2024-12-04") }
                ]
            },
            {
                _id: "prod-010",
                name: "Himalaya Face Wash",
                sku: "PERS-HFW-010",
                category: "Personal Care",
                totalStock: 650,
                minStock: 180,
                reorderLevel: 180,
                unit: "piece",
                stockLevels: [
                    { warehouseId: { _id: "wh-002", name: "Delhi Logistics Hub" }, quantity: 240, lastUpdated: new Date("2024-12-07") },
                    { warehouseId: { _id: "wh-004", name: "Chennai Distribution Center" }, quantity: 220, lastUpdated: new Date("2024-12-06") },
                    { warehouseId: { _id: "wh-005", name: "Ahmedabad Storage Facility" }, quantity: 190, lastUpdated: new Date("2024-12-05") }
                ]
            }
        ];

        return NextResponse.json({
            products: dummyStockData,
            statistics: {
                totalProducts: dummyStockData.length,
                totalStock: dummyStockData.reduce((sum, p) => sum + p.totalStock, 0),
                lowStockCount: dummyStockData.filter(p => p.lowStock).length
            }
        });
    } catch (error) {
        console.error("Error fetching stock:", error);
        return NextResponse.json(
            { message: "Failed to fetch stock" },
            { status: 500 }
        );
    }
}
