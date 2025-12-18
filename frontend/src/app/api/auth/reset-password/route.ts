import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import { otpStore } from "@/lib/otp-store";

export async function POST(request: Request) {
    try {
        const { email, otp, newPassword } = await request.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { message: "Email, OTP, and new password are required" },
                { status: 400 }
            );
        }

        // Validate password length
        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find user by email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { message: "Invalid request" },
                { status: 400 }
            );
        }

        // Verify OTP
        const storedOTP = otpStore.get(user.email);

        if (!storedOTP) {
            return NextResponse.json(
                { message: "OTP not found. Please request a new verification code." },
                { status: 400 }
            );
        }

        if (Date.now() > storedOTP.expiresAt) {
            otpStore.delete(user.email);
            return NextResponse.json(
                { message: "OTP has expired. Please request a new verification code." },
                { status: 400 }
            );
        }

        if (storedOTP.otp !== otp) {
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear any old reset tokens
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Delete used OTP
        otpStore.delete(user.email);

        return NextResponse.json({
            message: "Password reset successful. You can now login with your new password."
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
