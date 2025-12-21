import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

export interface UserPayload {
    userId: string;
    email: string;
    role: "admin" | "inventory_manager" | "warehouse_staff" | "environment_manager" | "auditor";
}

/**
 * Get the current user from JWT token in cookies
 * Returns null if no token or invalid token
 */
export async function getCurrentUser(): Promise<UserPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as UserPayload;
        return decoded;
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}

/**
 * Check if current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "admin";
}

/**
 * Check if current user has inventory access
 */
export async function hasInventoryAccess(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "inventory_manager" || user?.role === "warehouse_staff" || user?.role === "admin";
}

/**
 * Check if current user has warehouse operations access
 */
export async function hasWarehouseAccess(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "warehouse_staff" || user?.role === "admin";
}
