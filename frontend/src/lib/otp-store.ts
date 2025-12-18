// In-memory OTP storage
// In production, use Redis or a database for persistence across server restarts
export const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// Generate 6-digit OTP
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired OTPs periodically
setInterval(() => {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
        }
    }
}, 5 * 60 * 1000); // Clean up every 5 minutes
