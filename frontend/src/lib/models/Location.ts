import mongoose, { Schema, model, models } from 'mongoose';

const LocationSchema = new Schema({
    locationId: {
        type: String,
        required: [true, 'Location ID is required'],
        unique: true,
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
    },
    state: {
        type: String,
        required: [true, 'State is required'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound unique index to ensure unique country-state-city combinations
LocationSchema.index({ country: 1, state: 1, city: 1 }, { unique: true });

const Location = models.Location || model('Location', LocationSchema);

export default Location;
