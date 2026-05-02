const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema({
    city: {
        type: String,
        required: true,
        unique: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    aqi: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
