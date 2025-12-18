import { NextResponse } from "next/server";

// Dummy user profile data
const dummyProfile = {
    id: "user-001",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@stock2door.com",
    role: "Fleet Manager",
};

// GET - Fetch current user profile (dummy data)
export async function GET(request: Request) {
    try {
        // Return dummy profile data
        return NextResponse.json(dummyProfile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { message: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

// PUT - Update user profile (dummy data)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email } = body;

        // Basic validation
        if (!firstName || !lastName || !email) {
            return NextResponse.json(
                { message: "First name, last name, and email are required" },
                { status: 400 }
            );
        }

        // Return updated dummy profile with the new data
        return NextResponse.json({
            id: dummyProfile.id,
            firstName,
            lastName,
            email,
            role: dummyProfile.role,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { message: "Failed to update profile" },
            { status: 500 }
        );
    }
}
