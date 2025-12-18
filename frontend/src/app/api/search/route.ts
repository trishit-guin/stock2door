import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/lib/models/Product";
import Warehouse from "@/lib/models/Warehouse";
import Location from "@/lib/models/Location";
import Move from "@/lib/models/Move";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        await connectToDatabase();

        const searchRegex = new RegExp(query, "i");
        const results: any[] = [];

        // Search Products
        const products = await Product.find({
            $or: [
                { name: searchRegex },
                { sku: searchRegex },
                { category: searchRegex }
            ]
        })
            .limit(5)
            .select("_id name sku totalStock")
            .lean();

        products.forEach((product: any) => {
            results.push({
                id: product._id.toString(),
                type: "product",
                title: product.name,
                subtitle: `SKU: ${product.sku} • Stock: ${product.totalStock || 0}`,
                url: `/products/${product._id}/edit`
            });
        });

        // Search Warehouses
        const warehouses = await Warehouse.find({
            $or: [
                { name: searchRegex },
                { type: searchRegex }
            ]
        })
            .limit(5)
            .select("_id name type address")
            .lean();

        warehouses.forEach((warehouse: any) => {
            results.push({
                id: warehouse._id.toString(),
                type: "warehouse",
                title: warehouse.name,
                subtitle: `Type: ${warehouse.type} ${warehouse.address ? `• ${warehouse.address}` : ""}`,
                url: `/operations/warehouse`
            });
        });

        // Search Locations
        const locations = await Location.find({
            $or: [
                { name: searchRegex },
                { code: searchRegex }
            ]
        })
            .limit(5)
            .select("_id name code type")
            .lean();

        locations.forEach((location: any) => {
            results.push({
                id: location._id.toString(),
                type: "location",
                title: location.name,
                subtitle: `Code: ${location.code} • Type: ${location.type}`,
                url: `/locations`
            });
        });

        // Search Operations (Moves)
        const moves = await Move.find({
            type: searchRegex
        })
            .limit(3)
            .select("_id type status createdAt")
            .lean();

        moves.forEach((move: any) => {
            const opType = move.type.charAt(0).toUpperCase() + move.type.slice(1);
            results.push({
                id: move._id.toString(),
                type: "operation",
                title: `${opType} Operation`,
                subtitle: `Status: ${move.status} • ${new Date(move.createdAt).toLocaleDateString()}`,
                url: `/operations/${move.type}s`
            });
        });

        // Sort by relevance (exact matches first)
        results.sort((a, b) => {
            const aExact = a.title.toLowerCase() === query.toLowerCase() ? 1 : 0;
            const bExact = b.title.toLowerCase() === query.toLowerCase() ? 1 : 0;
            return bExact - aExact;
        });

        return NextResponse.json(results.slice(0, 10));
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { message: "Search failed" },
            { status: 500 }
        );
    }
}
