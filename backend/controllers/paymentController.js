const Razorpay = require('razorpay');
const crypto = require('crypto');
const Event = require('../models/Event');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order for event registration
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { eventId } = req.body;

        // Find the event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if event requires payment
        if (event.ticketPrice === 0) {
            return res.status(400).json({ message: 'This is a free event' });
        }

        // Check if user is already registered
        if (event.attendees.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Check if event is full
        if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is full' });
        }

        // Create Razorpay order
        const options = {
            amount: event.ticketPrice * 100, // Amount in paise (multiply by 100)
            currency: 'INR',
            receipt: `event_${eventId}_user_${req.user._id}_${Date.now()}`,
            notes: {
                eventId: eventId,
                userId: req.user._id.toString(),
                eventTitle: event.title,
            },
        };

        const order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            eventTitle: event.title,
            eventId: eventId,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create payment order', error: error.message });
    }
};

// @desc    Verify payment and register user for event
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId } = req.body;

        // Create signature for verification
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        // Verify signature
        if (razorpay_signature === expectedSign) {
            // Payment is verified, register user for event
            const event = await Event.findById(eventId);

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            // Check if user is already registered
            if (event.attendees.includes(req.user._id)) {
                return res.status(400).json({ message: 'Already registered for this event' });
            }

            // Add user to attendees
            event.attendees.push(req.user._id);
            const updatedEvent = await event.save();

            res.json({
                message: 'Payment verified and registration successful',
                event: updatedEvent,
                paymentId: razorpay_payment_id,
            });
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
};

// @desc    Get payment status
// @route   GET /api/payments/:orderId/status
// @access  Private
const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await razorpay.orders.fetch(orderId);

        res.json({
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ message: 'Failed to fetch payment status', error: error.message });
    }
};

module.exports = { createOrder, verifyPayment, getPaymentStatus };
