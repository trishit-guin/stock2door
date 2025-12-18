import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/lib/models/Product";
import Move from "@/lib/models/Move";

// GET - Fetch stock value report
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const warehouseId = searchParams.get("warehouse");
        const reportType = searchParams.get("type") || "value"; // value, movement, summary
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");

        // Return dummy report data matching logistics theme
        if (reportType === "value") {
            // Stock Value Report with Indian logistics products
            const dummyProducts = [
                { productId: "prod-001", name: "Basmati Rice Premium", sku: "RICE-BAS-001", category: "Food & Grains", quantity: 3500, uom: "kg", price: 120, value: 420000 },
                { productId: "prod-002", name: "Tata Tea Gold", sku: "TEA-TG-002", category: "Beverages", quantity: 2800, uom: "kg", price: 450, value: 1260000 },
                { productId: "prod-003", name: "Amul Butter", sku: "DAIRY-AMB-003", category: "Dairy Products", quantity: 2200, uom: "units", price: 260, value: 572000 },
                { productId: "prod-004", name: "Parle-G Biscuits", sku: "SNACK-PG-004", category: "Snacks", quantity: 4500, uom: "packs", price: 45, value: 202500 },
                { productId: "prod-005", name: "Fortune Sunflower Oil", sku: "OIL-FSO-005", category: "Cooking Oil", quantity: 1680, uom: "litres", price: 850, value: 1428000 },
                { productId: "prod-006", name: "Maggi Noodles", sku: "FOOD-MN-006", category: "Instant Food", quantity: 1950, uom: "boxes", price: 12, value: 23400 },
                { productId: "prod-007", name: "Surf Excel Detergent", sku: "CARE-SE-007", category: "Home Care", quantity: 1200, uom: "kg", price: 380, value: 456000 },
                { productId: "prod-008", name: "Colgate Toothpaste", sku: "CARE-CT-008", category: "Personal Care", quantity: 3200, uom: "units", price: 85, value: 272000 },
                { productId: "prod-009", name: "Britannia Marie", sku: "SNACK-BM-009", category: "Snacks", quantity: 2100, uom: "packs", price: 30, value: 63000 },
                { productId: "prod-010", name: "Aashirvaad Atta", sku: "FOOD-AA-010", category: "Food & Grains", quantity: 4200, uom: "kg", price: 42, value: 176400 }
            ];

            const filteredData = warehouseId === "all" || !warehouseId ? dummyProducts : dummyProducts.slice(0, 6);
            
            const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);
            const totalItems = filteredData.length;
            const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0);

            return NextResponse.json({
                type: "value",
                summary: {
                    totalValue,
                    totalItems,
                    totalQuantity,
                    averageValue: totalItems > 0 ? totalValue / totalItems : 0
                },
                items: filteredData
            });
        }

        if (reportType === "movement") {
            // Stock Movement Report
            const dummyMovements = [
                { productId: "prod-001", name: "Basmati Rice Premium", sku: "RICE-BAS-001", category: "Food & Grains", receipts: 500, deliveries: 320, transfers: 180, adjustments: 20, netChange: 200 },
                { productId: "prod-002", name: "Tata Tea Gold", sku: "TEA-TG-002", category: "Beverages", receipts: 400, deliveries: 280, transfers: 150, adjustments: -10, netChange: 110 },
                { productId: "prod-003", name: "Amul Butter", sku: "DAIRY-AMB-003", category: "Dairy Products", receipts: 300, deliveries: 250, transfers: 100, adjustments: 0, netChange: 50 },
                { productId: "prod-005", name: "Fortune Sunflower Oil", sku: "OIL-FSO-005", category: "Cooking Oil", receipts: 200, deliveries: 180, transfers: 80, adjustments: 15, netChange: 35 },
                { productId: "prod-006", name: "Maggi Noodles", sku: "FOOD-MN-006", category: "Instant Food", receipts: 350, deliveries: 320, transfers: 120, adjustments: -5, netChange: 25 },
                { productId: "prod-007", name: "Surf Excel Detergent", sku: "CARE-SE-007", category: "Home Care", receipts: 150, deliveries: 140, transfers: 60, adjustments: 10, netChange: 20 },
                { productId: "prod-008", name: "Colgate Toothpaste", sku: "CARE-CT-008", category: "Personal Care", receipts: 450, deliveries: 380, transfers: 200, adjustments: 0, netChange: 70 }
            ];

            return NextResponse.json({
                type: "movement",
                summary: {
                    totalMoves: 1247,
                    totalProducts: dummyMovements.length,
                    dateRange: { from: dateFrom || "2024-11-01", to: dateTo || "2024-12-07" }
                },
                items: dummyMovements
            });
        }

        if (reportType === "summary") {
            // Dashboard Summary Report
            return NextResponse.json({
                type: "summary",
                data: {
                    totalProducts: 142,
                    lowStockProducts: 8,
                    todayMoves: 34,
                    totalMoves: 1247,
                    movesByType: {
                        receipt: 485,
                        delivery: 624,
                        transfer: 156,
                        adjustment: 23
                    }
                }
            });
        }

        return NextResponse.json(
            { message: "Invalid report type" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error generating report:", error);
        return NextResponse.json(
            { message: "Failed to generate report" },
            { status: 500 }
        );
    }
}
