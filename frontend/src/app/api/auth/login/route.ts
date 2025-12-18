import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Dummy users for demo (password: 123456 for all)
        const dummyUsers: Record<string, any> = {
            "trishit@gmail.com": {
                _id: "admin-001",
                email: "trishit@gmail.com",
                role: "admin",
                firstName: "Trishit",
                lastName: "Guin"
            },
            "admin@stock2door.com": {
                _id: "admin-002",
                email: "admin@stock2door.com",
                role: "admin",
                firstName: "Rajesh",
                lastName: "Kumar"
            },
            "manager@stock2door.com": {
                _id: "manager-001",
                email: "manager@stock2door.com",
                role: "manager",
                firstName: "Priya",
                lastName: "Sharma"
            },
            "warehouse.manager@stock2door.com": {
                _id: "manager-002",
                email: "warehouse.manager@stock2door.com",
                role: "manager",
                firstName: "Amit",
                lastName: "Patel"
            },
            "staff@stock2door.com": {
                _id: "staff-001",
                email: "staff@stock2door.com",
                role: "staff",
                firstName: "Vikram",
                lastName: "Singh"
            },
            "staff.mumbai@stock2door.com": {
                _id: "staff-002",
                email: "staff.mumbai@stock2door.com",
                role: "staff",
                firstName: "Sneha",
                lastName: "Reddy"
            },
            "staff.delhi@stock2door.com": {
                _id: "staff-003",
                email: "staff.delhi@stock2door.com",
                role: "staff",
                firstName: "Arjun",
                lastName: "Mehta"
            }
        };

        if (password === "123456" && dummyUsers[email]) {
            const dummyUser = dummyUsers[email];

            const token = jwt.sign(
                { userId: dummyUser._id, email: dummyUser.email, role: dummyUser.role },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

            const response = NextResponse.json(
                { 
                    message: "Login successful", 
                    user: { 
                        id: dummyUser._id, 
                        email: dummyUser.email, 
                        role: dummyUser.role, 
                        firstName: dummyUser.firstName, 
                        lastName: dummyUser.lastName 
                    } 
                },
                { status: 200 }
            );

            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 86400,
                path: "/",
            });

            return response;
        }

        await connectToDatabase();

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json(
            { message: "Login successful", user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } },
            { status: 200 }
        );

        // Set HTTP-only cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400, // 1 day
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
