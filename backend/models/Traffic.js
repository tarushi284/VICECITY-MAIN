const mongoose = require('mongoose');

const trafficSchema = mongoose.Schema({
    location: {
        type: String,
        required: true,
    },
    description: {
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
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Traffic = mongoose.model('Traffic', trafficSchema);

module.exports = Traffic;
