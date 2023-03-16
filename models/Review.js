import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
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

export default mongoose.model('Review', ReviewSchema);