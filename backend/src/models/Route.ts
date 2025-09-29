import mongoose, { Document, Schema } from 'mongoose';

export interface IRoute extends Document {
  deliveries: mongoose.Types.ObjectId[];
  vehicle: mongoose.Types.ObjectId;
  path: { lat: number; lng: number }[];
  distance: number;
  eta: number;
  emissions: number;
  createdAt: Date;
}

const RouteSchema = new Schema<IRoute>({
  deliveries: [{ type: Schema.Types.ObjectId, ref: 'Delivery', required: true }],
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  path: [{ lat: Number, lng: Number }],
  distance: { type: Number, required: true },
  eta: { type: Number, required: true },
  emissions: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Route = mongoose.model<IRoute>('Route', RouteSchema);
export default Route; 