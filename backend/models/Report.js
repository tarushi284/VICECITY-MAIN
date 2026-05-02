const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        required: true,
        enum: ['crime', 'infrastructure', 'cleanliness', 'traffic', 'other'],
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'investigating', 'resolved', 'approved', 'rejected'],
        default: 'pending',
    },
    imageUrl: {
        type: String,
    },
}, {
    timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
