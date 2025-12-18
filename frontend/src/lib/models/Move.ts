import mongoose, { Schema, model, models } from 'mongoose';

const MoveSchema = new Schema({
    type: {
        type: String,
        enum: ['receipt', 'delivery', 'internal', 'adjustment'],
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'waiting', 'ready', 'done', 'canceled'],
        default: 'draft',
    },
    date: {
        type: Date,
        required: true,
    },
    // For internal moves, these are Warehouse IDs. 
    sourceLocation: {
        type: Schema.Types.ObjectId,
        ref: 'Warehouse',
    },
    destinationLocation: {
        type: Schema.Types.ObjectId,
        ref: 'Warehouse',
    },
    // Optional: External partner name for Receipts/Deliveries
    partnerName: String,
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Move = models.Move || model('Move', MoveSchema);

export default Move;
