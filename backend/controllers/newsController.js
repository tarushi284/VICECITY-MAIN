const News = require('../models/News');

// @desc    Get all active news/schemes
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
    const news = await News.find({ active: true }).sort({ createdAt: -1 });
    res.json(news);
};

// @desc    Create news/scheme
// @route   POST /api/news
// @access  Private/Admin
const createNews = async (req, res) => {
    const { title, content, category, imageUrl } = req.body;

    const news = new News({
        title,
        content,
        category,
        imageUrl,
    });

    const createdNews = await news.save();
    res.status(201).json(createdNews);
};

// @desc    Update news/scheme
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = async (req, res) => {
    const { title, content, category, imageUrl } = req.body;
    const news = await News.findById(req.params.id);

    if (news) {
        news.title = title || news.title;
        news.content = content || news.content;
        news.category = category || news.category;
        news.imageUrl = imageUrl || news.imageUrl;

        const updatedNews = await news.save();
        res.json(updatedNews);
    } else {
        res.status(404).json({ message: 'News not found' });
    }
};

// @desc    Delete news/scheme
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = async (req, res) => {
    const news = await News.findById(req.params.id);

    if (news) {
        await news.deleteOne();
        res.json({ message: 'News removed' });
    } else {
        res.status(404).json({ message: 'News not found' });
    }
};

module.exports = { getNews, createNews, updateNews, deleteNews };
