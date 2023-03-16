import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    Count: {
        type: Number,
        default: 1,
    },
    text:{
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: String,
},
{
    timestamp: true,
},
);

export default mongoose.model('Order', OrderSchema);