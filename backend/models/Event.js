const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
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
    date: {
        type: Date,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    ticketPrice: {
        type: Number,
        default: 0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    maxAttendees: {
        type: Number,
        default: null,
    },
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
