import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
    },
    category: String,
    uom: String, // Unit of Measure
    price: {
        type: Number,
        default: 0,
    },
    minStock: {
        type: Number,
        default: 0,
    },
    // Total stock across all locations (cached value)
    totalStock: {
        type: Number,
        default: 0,
    },
    // Detailed stock per location
    stockLevels: [{
        warehouseId: {
            type: Schema.Types.ObjectId,
            ref: 'Warehouse',
        },
        quantity: {
            type: Number,
            default: 0,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;
