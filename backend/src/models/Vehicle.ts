import mongoose, { Schema, HydratedDocument } from 'mongoose';

export interface IVehicle {
  type: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  vehicleNumber: string;
  capacity: number;
  assignedCluster?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  type: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  fuelType: { type: String, required: true },
  vehicleNumber: { type: String, required: true, unique: true },
  capacity: { 
    type: Number, 
    default: function() {
      switch(this.type) {
        case 'LCV': return 1000;
        case 'MCV': return 5000;
        case 'HCV': return 15000;
        case 'THREE_WHEELER': return 500;
        default: return 1000;
      }
    }
  },
  assignedCluster: { type: Schema.Types.ObjectId, ref: 'Cluster' },
  createdAt: { type: Date, default: Date.now },
});

type VehicleDocument = HydratedDocument<IVehicle>;

const Vehicle = mongoose.model<IVehicle>(
  'Vehicle',
  VehicleSchema
);
export default Vehicle; 