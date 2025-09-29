import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  LOGISTICS_MANAGER = 'logistics_manager',
  FLEET_OPERATOR = 'fleet_operator',
  SUSTAINABILITY_OFFICER = 'sustainability_officer',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  googleId?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for OAuth
  role: { type: String, enum: Object.values(UserRole), required: true },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User; 