import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      sparse: true,
    },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: { type: String, default: 'France' },
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalPizzas: {
      type: Number,
      default: 0,
    },
    loyaltyPizzasRedeemed: {
      type: Number,
      default: 0,
    },
    lastOrderDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Customer =
  mongoose.models.Customer ||
  mongoose.model('Customer', CustomerSchema);

export default Customer;
