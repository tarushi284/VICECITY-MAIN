const Traffic = require('../models/Traffic');

// @desc    Get all active traffic alerts
// @route   GET /api/traffic
// @access  Public
const getTrafficAlerts = async (req, res) => {
    const alerts = await Traffic.find({ active: true }).sort({ createdAt: -1 });
    res.json(alerts);
};

// @desc    Create a traffic alert
// @route   POST /api/traffic
// @access  Private/Admin
const createTrafficAlert = async (req, res) => {
    const { location, description, severity, latitude, longitude } = req.body;

    const alert = new Traffic({
        location,
        description,
        severity,
        latitude,
        longitude,
        reportedBy: req.user._id,
    });

    const createdAlert = await alert.save();
    res.status(201).json(createdAlert);
};

// @desc    Resolve/Remove a traffic alert
// @route   PUT /api/traffic/:id
// @access  Private/Admin
const resolveTrafficAlert = async (req, res) => {
    const alert = await Traffic.findById(req.params.id);

    if (alert) {
        alert.active = false;
        const updatedAlert = await alert.save();
        res.json(updatedAlert);
    } else {
        res.status(404).json({ message: 'Alert not found' });
    }
};

// @desc    Delete a traffic alert
// @route   DELETE /api/traffic/:id
// @access  Private/Admin
const deleteTrafficAlert = async (req, res) => {
    const alert = await Traffic.findById(req.params.id);

    if (alert) {
        await alert.deleteOne();
        res.json({ message: 'Alert removed' });
    } else {
        res.status(404).json({ message: 'Alert not found' });
    }
};

module.exports = { getTrafficAlerts, createTrafficAlert, resolveTrafficAlert, deleteTrafficAlert };
