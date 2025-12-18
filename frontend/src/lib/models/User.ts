import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    firstName: String,
    lastName: String,
    name: String, // For SmartRoute users
    role: {
        type: String,
        enum: ['admin', 'logistics_manager', 'fleet_operator', 'sustainability_manager', 'manager', 'staff'],
        default: 'staff',
    },
    resetPasswordToken: {
        type: String,
        select: false,
    },
    resetPasswordExpires: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = models.User || model('User', UserSchema);

export default User;
