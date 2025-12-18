import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET() {
    try {
        // Return dummy products for demo
        const dummyProducts = [
            {
                _id: "prod-001",
                name: "Basmati Rice Premium",
                sku: "RICE-BAS-001",
                category: "Food & Grains",
                description: "Premium quality Basmati rice from Punjab",
                unit: "kg",
                reorderLevel: 500,
                totalStock: 2500,
                lowStock: false,
                price: 120,
                supplier: "Punjab Grains Ltd",
                createdAt: new Date("2024-12-01"),
                updatedAt: new Date("2024-12-07")
            },
            {
                _id: "prod-002",
                name: "Tata Tea Gold",
                sku: "TEA-TG-002",
                category: "Beverages",
                description: "Premium tea blend from Tata",
                unit: "kg",
                reorderLevel: 200,
                totalStock: 850,
                lowStock: false,
                price: 450,
                supplier: "Tata Consumer Products",
                createdAt: new Date("2024-11-28"),
                updatedAt: new Date("2024-12-06")
            },
            {
                _id: "prod-003",
                name: "Amul Butter",
                sku: "DAIRY-AMB-003",
                category: "Dairy Products",
                description: "Fresh Amul butter 500g pack",
                unit: "pack",
                reorderLevel: 300,
                totalStock: 1200,
                lowStock: false,
                price: 260,
                supplier: "Amul Dairy",
                createdAt: new Date("2024-12-02"),
                updatedAt: new Date("2024-12-07")
            },
            {
                _id: "prod-004",
                name: "Parle-G Biscuits",
                sku: "SNACK-PG-004",
                category: "Snacks",
                description: "Original Parle-G glucose biscuits",
                unit: "carton",
                reorderLevel: 500,
                totalStock: 450,
                lowStock: true,
                price: 180,
                supplier: "Parle Products",
                createdAt: new Date("2024-11-30"),
                updatedAt: new Date("2024-12-05")
            },
            {
                _id: "prod-005",
                name: "Fortune Sunflower Oil",
                sku: "OIL-FSO-005",
                category: "Cooking Oil",
                description: "Refined sunflower oil 5L pack",
                unit: "liter",
                reorderLevel: 150,
                totalStock: 680,
                lowStock: false,
                price: 850,
                supplier: "Adani Wilmar",
                createdAt: new Date("2024-12-03"),
                updatedAt: new Date("2024-12-07")
            },
            {
                _id: "prod-006",
                name: "Maggi Noodles",
                sku: "FOOD-MN-006",
                category: "Instant Food",
                description: "Masala Maggi noodles 2-minute",
                unit: "carton",
                reorderLevel: 200,
                totalStock: 950,
                lowStock: false,
                price: 12,
                supplier: "Nestle India",
                createdAt: new Date("2024-11-29"),
                updatedAt: new Date("2024-12-06")
            },
            {
                _id: "prod-007",
                name: "Surf Excel Detergent",
                sku: "HOME-SE-007",
                category: "Home Care",
                description: "Surf Excel matic front load 2kg",
                unit: "kg",
                reorderLevel: 500,
                totalStock: 420,
                lowStock: true,
                price: 380,
                supplier: "Hindustan Unilever",
                createdAt: new Date("2024-12-01"),
                updatedAt: new Date("2024-12-07")
            },
            {
                _id: "prod-008",
                name: "Colgate MaxFresh",
                sku: "PERS-CM-008",
                category: "Personal Care",
                description: "Colgate MaxFresh toothpaste 150g",
                unit: "piece",
                reorderLevel: 250,
                totalStock: 890,
                lowStock: false,
                price: 95,
                supplier: "Colgate Palmolive",
                createdAt: new Date("2024-12-02"),
                updatedAt: new Date("2024-12-06")
            },
            {
                _id: "prod-009",
                name: "Britannia Marie Gold",
                sku: "SNACK-BMG-009",
                category: "Snacks",
                description: "Britannia Marie Gold biscuits",
                unit: "carton",
                reorderLevel: 120,
                totalStock: 520,
                lowStock: false,
                price: 160,
                supplier: "Britannia Industries",
                createdAt: new Date("2024-11-27"),
                updatedAt: new Date("2024-12-05")
            },
            {
                _id: "prod-010",
                name: "Himalaya Face Wash",
                sku: "PERS-HFW-010",
                category: "Personal Care",
                description: "Himalaya neem face wash 150ml",
                unit: "piece",
                reorderLevel: 180,
                totalStock: 650,
                lowStock: false,
                price: 135,
                supplier: "Himalaya Wellness",
                createdAt: new Date("2024-12-04"),
                updatedAt: new Date("2024-12-07")
            }
        ];

        return NextResponse.json(dummyProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { message: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Basic validation
        if (!body.name || !body.sku) {
            return NextResponse.json(
                { message: "Name and SKU are required" },
                { status: 400 }
            );
        }

        const existingProduct = await Product.findOne({ sku: body.sku });
        if (existingProduct) {
            return NextResponse.json(
                { message: "Product with this SKU already exists" },
                { status: 400 }
            );
        }

        const product = await Product.create(body);

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { message: "Failed to create product" },
            { status: 500 }
        );
    }
}
