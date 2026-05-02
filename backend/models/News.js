const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['awareness', 'scheme', 'news'],
        default: 'news',
    },
    imageUrl: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
