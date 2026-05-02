const Report = require('../models/Report');
const Traffic = require('../models/Traffic');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
    const { type, description, location, imageUrl, severity, latitude, longitude } = req.body;

    if (type === 'traffic' && (!latitude || !longitude)) {
        return res.status(400).json({ message: 'Traffic reports must have a location selected on the map.' });
    }

    const report = new Report({
        user: req.user._id,
        type,
        description,
        location,
        imageUrl,
        severity,
        latitude,
        longitude
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
};

// @desc    Get all reports (Admin) or my reports (Citizen)
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'admin') {
        const reports = await Report.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(reports);
    } else {
        const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(reports);
    }
};

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (report) {
        report.status = status;
        const updatedReport = await report.save();

        // If traffic report is approved, add to traffic alerts
        if (report.type === 'traffic' && status === 'approved') {
            const trafficValid = report.latitude && report.longitude;

            if (trafficValid) {
                // Check if already exists to avoid duplicates (optional, based on simple check)
                // For now, just create new one
                await Traffic.create({
                    location: report.location,
                    description: report.description,
                    severity: report.severity || 'medium',
                    latitude: report.latitude,
                    longitude: report.longitude,
                    reportedBy: report.user,
                    active: true
                });
            }
        }

        res.json(updatedReport);
    } else {
        res.status(404).json({ message: 'Report not found' });
    }
};

module.exports = { createReport, getReports, updateReportStatus };
