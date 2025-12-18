import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
    try {
        // Check if email configuration is set
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.error('Email configuration missing: EMAIL_USER or EMAIL_PASSWORD not set');
            return { success: false, error: new Error('Email configuration missing') };
        }

        const mailOptions = {
            from: `"Stock2Door" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        console.log('Attempting to send email to:', to);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error('Error sending email:', error);
        console.error('Error details:', {
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        return { success: false, error };
    }
}

export function generateResetPasswordEmail(resetUrl: string, userName: string) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1A73E8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #1A73E8; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Stock2Door</h1>
            </div>
            <div class="content">
                <h2>Reset Your Password</h2>
                <p>Hello ${userName},</p>
                <p>We received a request to reset your password for your Stock2Door account. Click the button below to create a new password:</p>
                <p style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </p>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #1A73E8;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                <p>Best regards,<br>The Stock2Door Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Stock2Door. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const text = `
    Reset Your Password
    
    Hello ${userName},
    
    We received a request to reset your password for your Stock2Door account. 
    
    Click this link to create a new password: ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request a password reset, please ignore this email.
    
    Best regards,
    The Stock2Door Team
    `;

    return { html, text };
}

export function generateOTPEmail(otp: string, userName: string) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1A73E8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-box { background-color: white; border: 2px dashed #1A73E8; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #1A73E8; letter-spacing: 8px; font-family: monospace; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Stock2Door</h1>
            </div>
            <div class="content">
                <h2>Password Change Verification</h2>
                <p>Hello ${userName},</p>
                <p>We received a request to change your password. Use the verification code below to proceed:</p>
                <div class="otp-box">
                    <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
                    <p class="otp-code">${otp}</p>
                </div>
                <p><strong>This code will expire in 10 minutes.</strong></p>
                <p>If you didn't request a password change, please ignore this email and ensure your account is secure.</p>
                <p>Best regards,<br>The Stock2Door Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Stock2Door. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const text = `
    Password Change Verification
    
    Hello ${userName},
    
    We received a request to change your password. Use the verification code below to proceed:
    
    Your Verification Code: ${otp}
    
    This code will expire in 10 minutes.
    
    If you didn't request a password change, please ignore this email.
    
    Best regards,
    The Stock2Door Team
    `;

    return { html, text };
}
