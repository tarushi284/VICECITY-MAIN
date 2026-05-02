const Contact = require('../models/Contact');

// @desc    Get all emergency contacts
// @route   GET /api/contacts
// @access  Public
const getContacts = async (req, res) => {
    const contacts = await Contact.find({});
    res.json(contacts);
};

// @desc    Create an emergency contact
// @route   POST /api/contacts
// @access  Private/Admin
const createContact = async (req, res) => {
    const { name, number, type } = req.body;

    const contact = new Contact({
        name,
        number,
        type,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
};

// @desc    Update an emergency contact
// @route   PUT /api/contacts/:id
// @access  Private/Admin
const updateContact = async (req, res) => {
    const { name, number, type } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (contact) {
        contact.name = name || contact.name;
        contact.number = number || contact.number;
        contact.type = type || contact.type;

        const updatedContact = await contact.save();
        res.json(updatedContact);
    } else {
        res.status(404).json({ message: 'Contact not found' });
    }
};

// @desc    Delete an emergency contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
        await contact.deleteOne();
        res.json({ message: 'Contact removed' });
    } else {
        res.status(404).json({ message: 'Contact not found' });
    }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };
