import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import { sendEmail, generateOTPEmail } from "@/lib/email";
import { otpStore, generateOTP } from "@/lib/otp-store";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists for security
            return NextResponse.json(
                { message: "If an account exists with that email, you will receive a verification code." },
                { status: 200 }
            );
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Store OTP
        otpStore.set(user.email, { otp, expiresAt });

        // Generate email content
        const { html, text } = generateOTPEmail(otp, user.firstName || user.email);

        // Send email
        const emailResult = await sendEmail({
            to: user.email,
            subject: 'Password Reset Verification - StockMaster',
            html,
            text,
        });

        console.log('Email send result:', emailResult);

        if (!emailResult.success) {
            // Remove OTP if email fails
            otpStore.delete(user.email);

            console.error('Email sending failed, returning error to client');
            return NextResponse.json(
                { message: "Failed to send verification code. Please try again later." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Verification code sent to your email"
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
