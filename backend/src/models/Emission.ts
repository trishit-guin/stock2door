import mongoose, { Document, Schema } from 'mongoose';

export interface IEmission extends Document {
  route: mongoose.Types.ObjectId;
  vehicle: mongoose.Types.ObjectId;
  co2: number;
  fuelUsed: number;
  createdAt: Date;
}

const EmissionSchema = new Schema<IEmission>({
  route: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  co2: { type: Number, required: true },
  fuelUsed: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Emission = mongoose.model<IEmission>('Emission', EmissionSchema);
export default Emission; 