import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['pizza', 'boisson', 'dessert', 'accompagnement'],
    required: true
  },
  image: String,
  ingredients: [String],
  available: { type: Boolean, default: true },
  customizable: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  spicy: { type: Boolean, default: false },
  vegetarian: { type: Boolean, default: false },
  tags: [String],
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  minStock: {
    type: Number,
    default: 10
  },
  sizeOptions: {
    medium: {
      available: { type: Boolean, default: true },
      priceModifier: { type: Number, default: 0 }
    },
    large: {
      available: { type: Boolean, default: true },
      priceModifier: { type: Number, default: 1 }
    }
  },
  availableExtras: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 1 }
  }]
}, {
  timestamps: true
});

// Add indexes for frequently queried fields
ProductSchema.index({ category: 1, available: 1 }); // For filtering by category and availability
ProductSchema.index({ available: 1, popular: 1 }); // For getting popular available products
ProductSchema.index({ name: 'text', description: 'text' }); // For text search

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);