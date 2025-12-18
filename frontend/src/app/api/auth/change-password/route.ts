import { NextRequest, NextResponse } from "next/server";

// Demo OTP for testing
const VALID_DEMO_OTP = "123456";

export async function POST(req: NextRequest) {
    try {
        const { otp, newPassword } = await req.json();

        if (!otp || !newPassword) {
            return NextResponse.json(
                { message: "OTP and new password are required" },
                { status: 400 }
            );
        }

        // Validate OTP (for demo, accept "123456")
        if (otp !== VALID_DEMO_OTP) {
            return NextResponse.json(
                { message: "Invalid OTP. Use 123456 for demo." },
                { status: 400 }
            );
        }

        // Validate password
        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Simulate successful password change
        console.log(`[DEMO] Password changed successfully for demo user`);

        return NextResponse.json({
            message: "Password changed successfully",
        });
    } catch (error: any) {
        console.error("Change password error:", error);
        return NextResponse.json(
            { message: error.message || "Failed to change password" },
            { status: 500 }
        );
    }
}
