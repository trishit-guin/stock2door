import mongoose, { Schema, HydratedDocument } from 'mongoose';

export interface IVehicle {
  type: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  capacity: number;
  range: number;
  emissionsFactor: number;
  assignedCluster?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  type: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  fuelType: { type: String, required: true },
  capacity: { type: Number, required: true },
  range: { type: Number, required: true },
  emissionsFactor: { type: Number, required: true },
  assignedCluster: { type: Schema.Types.ObjectId, ref: 'Cluster' },
  createdAt: { type: Date, default: Date.now },
});

type VehicleDocument = HydratedDocument<IVehicle>;

const Vehicle = mongoose.model<IVehicle>(
  'Vehicle',
  VehicleSchema
);
export default Vehicle; 