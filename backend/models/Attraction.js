const mongoose = require('mongoose');

const attractionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    entryFee: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Attraction = mongoose.model('Attraction', attractionSchema);

module.exports = Attraction;
