import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

export interface UserPayload {
    userId: string;
    email: string;
    role: "admin" | "logistics_manager" | "fleet_operator" | "sustainability_manager" | "manager" | "staff";
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
 * Check if current user has manager role (warehouse manager)
 */
export async function isManager(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "manager";
}

/**
 * Check if current user has staff role (warehouse staff)
 */
export async function isStaff(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "staff";
}

/**
 * Check if current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "admin";
}

/**
 * Check if current user has logistics manager role
 */
export async function isLogisticsManager(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "logistics_manager";
}

/**
 * Check if current user has access to inventory features (manager, staff, or admin)
 */
export async function hasInventoryAccess(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "manager" || user?.role === "staff" || user?.role === "admin";
}

/**
 * Check if current user has access to logistics features (logistics_manager, fleet_operator, sustainability_manager, or admin)
 */
export async function hasLogisticsAccess(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.role === "logistics_manager" || user?.role === "fleet_operator" || user?.role === "sustainability_manager" || user?.role === "admin";
}
