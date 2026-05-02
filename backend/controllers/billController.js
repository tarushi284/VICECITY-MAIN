const Bill = require('../models/Bill');

// @desc    Get all bills for logged in user (or specific user if admin)
// @route   GET /api/bills
// @access  Private
const getMyBills = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    let query = { user: req.user._id };

    // If admin and userId is provided in query, fetch for that user
    if (req.user.role === 'admin' && req.query.userId) {
        query = { user: req.query.userId };
    }

    const bills = await Bill.find(query);
    res.json(bills);
};

// @desc    Create a new bill (Admin only)
// @route   POST /api/bills
// @access  Private/Admin
const createBill = async (req, res) => {
    const { userId, type, amount, dueDate } = req.body;

    const bill = new Bill({
        user: userId,
        type,
        amount,
        dueDate,
    });

    const createdBill = await bill.save();
    res.status(201).json(createdBill);
};

// @desc    Pay a bill
// @route   PUT /api/bills/:id/pay
// @access  Private
const payBill = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const bill = await Bill.findById(req.params.id);

    if (bill) {
        if (bill.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        bill.status = 'paid';
        bill.paidAt = Date.now();

        const updatedBill = await bill.save();
        res.json(updatedBill);
    } else {
        res.status(404).json({ message: 'Bill not found' });
    }
};

module.exports = { getMyBills, createBill, payBill };
