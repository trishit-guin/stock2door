import mongoose, { Document, Schema } from 'mongoose';

export interface ICluster extends Document {
  deliveries: mongoose.Types.ObjectId[];
  centroid: { lat: number; lng: number };
  assignedVehicle?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ClusterSchema = new Schema<ICluster>({
  deliveries: [{ type: Schema.Types.ObjectId, ref: 'Delivery', required: true }],
  centroid: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  assignedVehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  createdAt: { type: Date, default: Date.now },
});

const Cluster = mongoose.model<ICluster>('Cluster', ClusterSchema);
export default Cluster; 