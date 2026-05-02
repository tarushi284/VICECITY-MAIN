const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        required: true,
        enum: ['electricity', 'water', 'gas', 'internet'],
    },
    amount: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    paidAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
