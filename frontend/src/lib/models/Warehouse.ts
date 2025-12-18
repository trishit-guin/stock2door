import mongoose, { Schema, model, models } from 'mongoose';

const WarehouseSchema = new Schema({
    warehouseId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['internal', 'customer', 'supplier', 'transit'],
        default: 'internal',
    },
    address: String,
    locationId: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Warehouse = models.Warehouse || model('Warehouse', WarehouseSchema);

export default Warehouse;
