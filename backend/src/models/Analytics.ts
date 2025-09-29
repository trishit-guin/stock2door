import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  fleet: mongoose.Types.ObjectId;
  kpis: Record<string, any>;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  fleet: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  kpis: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
export default Analytics; 