import mongoose, { Document, Schema } from 'mongoose';

export interface ISimulationScenario extends Document {
  user: mongoose.Types.ObjectId;
  parameters: Record<string, any>;
  results: Record<string, any>;
  createdAt: Date;
}

const SimulationScenarioSchema = new Schema<ISimulationScenario>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parameters: { type: Schema.Types.Mixed, required: true },
  results: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SimulationScenario = mongoose.model<ISimulationScenario>('SimulationScenario', SimulationScenarioSchema);
export default SimulationScenario; 