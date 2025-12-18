import { NextRequest, NextResponse } from "next/server";

// Dummy user data
const dummyUser = {
    email: "rajesh.kumar@stock2door.com",
    firstName: "Rajesh",
};

// Simulated OTP (for demo purposes)
const DEMO_OTP = "123456";

export async function POST(req: NextRequest) {
    try {
        // Simulate OTP generation and email sending
        console.log(`[DEMO] OTP sent to ${dummyUser.email}: ${DEMO_OTP}`);

        return NextResponse.json({
            message: "OTP sent to your email",
            email: dummyUser.email,
            // For demo purposes, we're including the OTP in response (remove in production)
            demoOTP: DEMO_OTP,
        });
    } catch (error: any) {
        console.error("Send OTP error:", error);
        return NextResponse.json(
            { message: error.message || "Failed to send OTP" },
            { status: 500 }
        );
    }
}
