import mongoose from 'mongoose';


const OrderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  cart: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cart', 
    required: true
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

  export default mongoose.model('Order', OrderSchema);