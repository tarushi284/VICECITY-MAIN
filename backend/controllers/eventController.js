const Event = require('../models/Event');

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set to start of day to include all events for today
        console.log('=== GET EVENTS REQUEST ===');
        console.log('Current date (start of day):', currentDate);
        console.log('Query: { date: { $gte:', currentDate, '} }');

        const events = await Event.find({ date: { $gte: currentDate } }).sort({ date: 1 });
        console.log('Found', events.length, 'events');
        console.log('Events:', events.map(e => ({ id: e._id, title: e.title, date: e.date })));
        console.log('=== GET EVENTS SUCCESS ===');

        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Failed to fetch event', error: error.message });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin/AttractionManager
const createEvent = async (req, res) => {
    try {
        console.log('=== CREATE EVENT REQUEST ===');
        console.log('User:', req.user?._id, 'Role:', req.user?.role);
        console.log('Request body:', req.body);

        const { title, description, location, date, imageUrl, ticketPrice, maxAttendees } = req.body;

        const event = new Event({
            title,
            description,
            location,
            date,
            imageUrl,
            ticketPrice: ticketPrice || 0,
            isPaid: ticketPrice > 0,
            maxAttendees,
            organizer: req.user._id,
        });

        console.log('Event object before save:', event);
        const createdEvent = await event.save();
        console.log('Event saved successfully:', createdEvent._id);
        console.log('=== CREATE EVENT SUCCESS ===');

        res.status(201).json(createdEvent);
    } catch (error) {
        console.error('=== CREATE EVENT ERROR ===');
        console.error('Error creating event:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin/AttractionManager
const updateEvent = async (req, res) => {
    try {
        const { title, description, location, date, imageUrl, ticketPrice, maxAttendees } = req.body;
        const event = await Event.findById(req.params.id);

        if (event) {
            event.title = title || event.title;
            event.description = description || event.description;
            event.location = location || event.location;
            event.date = date || event.date;
            event.imageUrl = imageUrl || event.imageUrl;
            event.ticketPrice = ticketPrice !== undefined ? ticketPrice : event.ticketPrice;
            event.isPaid = event.ticketPrice > 0;
            event.maxAttendees = maxAttendees !== undefined ? maxAttendees : event.maxAttendees;

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Failed to update event', error: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin/AttractionManager
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Failed to delete event', error: error.message });
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        // Check if event requires payment
        if (event.isPaid && event.ticketPrice > 0) {
            return res.status(400).json({
                message: 'This is a paid event. Please complete payment to register.',
                requiresPayment: true,
                ticketPrice: event.ticketPrice
            });
        }

        // Check if user is already registered
        if (event.attendees.includes(req.user._id)) {
            res.status(400).json({ message: 'Already registered for this event' });
            return;
        }

        // Check if event is full
        if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is full' });
        }

        event.attendees.push(req.user._id);
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

// @desc    Unregister from an event
// @route   DELETE /api/events/:id/register
// @access  Private
const unregisterFromEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        event.attendees = event.attendees.filter(
            (attendeeId) => attendeeId.toString() !== req.user._id.toString()
        );
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent };
