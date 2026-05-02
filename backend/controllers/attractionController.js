const Attraction = require('../models/Attraction');

// @desc    Get all attractions
// @route   GET /api/attractions
// @access  Public
const getAttractions = async (req, res) => {
    const attractions = await Attraction.find({});
    res.json(attractions);
};

// @desc    Create an attraction
// @route   POST /api/attractions
// @access  Private/Admin/AttractionManager
const createAttraction = async (req, res) => {
    const { name, description, location, imageUrl, entryFee } = req.body;

    const attraction = new Attraction({
        name,
        description,
        location,
        imageUrl,
        entryFee,
        manager: req.user._id,
    });

    const createdAttraction = await attraction.save();
    res.status(201).json(createdAttraction);
};

// @desc    Update an attraction
// @route   PUT /api/attractions/:id
// @access  Private/Admin/AttractionManager
const updateAttraction = async (req, res) => {
    const { name, description, location, imageUrl, entryFee } = req.body;
    const attraction = await Attraction.findById(req.params.id);

    if (attraction) {
        attraction.name = name || attraction.name;
        attraction.description = description || attraction.description;
        attraction.location = location || attraction.location;
        attraction.imageUrl = imageUrl || attraction.imageUrl;
        attraction.entryFee = entryFee !== undefined ? entryFee : attraction.entryFee;

        const updatedAttraction = await attraction.save();
        res.json(updatedAttraction);
    } else {
        res.status(404).json({ message: 'Attraction not found' });
    }
};

// @desc    Delete an attraction
// @route   DELETE /api/attractions/:id
// @access  Private/Admin/AttractionManager
const deleteAttraction = async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);

    if (attraction) {
        await attraction.deleteOne();
        res.json({ message: 'Attraction removed' });
    } else {
        res.status(404).json({ message: 'Attraction not found' });
    }
};

module.exports = { getAttractions, createAttraction, updateAttraction, deleteAttraction };
