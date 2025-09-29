import mongoose, { Document, Schema } from 'mongoose';

export interface IDelivery extends Document {
  source: string;
  destinations: string[];
  vehicle: mongoose.Types.ObjectId;
  status: string;
  cluster?: mongoose.Types.ObjectId;
  route?: mongoose.Types.ObjectId;
  scheduledAt: Date;
  createdAt: Date;
}

const DeliverySchema = new Schema<IDelivery>({
  source: { type: String, required: true },
  destinations: [{ type: String, required: true }],
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  status: { type: String, required: true },
  cluster: { type: Schema.Types.ObjectId, ref: 'Cluster' },
  route: { type: Schema.Types.ObjectId, ref: 'Route' },
  scheduledAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Delivery = mongoose.model<IDelivery>('Delivery', DeliverySchema);
export default Delivery; 