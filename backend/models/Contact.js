const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['police', 'ambulance', 'fire', 'disaster', 'other'],
        default: 'other',
    },
}, {
    timestamps: true,
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
