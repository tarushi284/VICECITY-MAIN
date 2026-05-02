const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password, adminSecretKey, managerSecretKey } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Enforce Admin Key for Admin Users
        if (user.role === 'admin') {
            const validAdminKey = process.env.ADMIN_SECRET_KEY || 'default_admin_key_secure_123';
            if (adminSecretKey !== validAdminKey) {
                res.status(401).json({ message: 'Invalid Admin Secret Key' });
                return;
            }
        }

        // Enforce Manager Key for Attraction Managers
        if (user.role === 'attraction_manager') {
            const validManagerKey = process.env.MANAGER_SECRET_KEY || 'default_manager_key_secure_123';
            // Extract managerSecretKey from body (need to ensure it's destructured at top or accessed from req.body)
            // Checking top of function... destructured const { email, password, adminSecretKey } = req.body;
            // Need to update destructuring as well.
            const { managerSecretKey } = req.body;
            if (managerSecretKey !== validManagerKey) {
                res.status(401).json({ message: 'Invalid Manager Secret Key' });
                return;
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, phone, address, adminSecretKey, managerSecretKey } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Secure Role Assignment
    let finalRole = 'citizen';
    if (role === 'admin') {
        const validAdminKey = process.env.ADMIN_SECRET_KEY || 'default_admin_key_secure_123';
        if (adminSecretKey === validAdminKey) {
            finalRole = 'admin';
        } else {
            // Failed admin attempt -> fallback to citizen (or could error out, but fallback allows regression to safe state)
            // Ideally notify user, but for now we just demote to citizen to prevent exploit.
            // Actually, if they ASK for admin and fail key, maybe better to error? 
            // Requirement says: "Explicitly set the role to citizen (or default) during public registration."
            // "Do it and add login as admin feature ... where we have to enter a key"
            // I will enforce: if requesting admin, MUST have key.
            finalRole = 'citizen';
        }
    } else if (role === 'attraction_manager') {
        const validManagerKey = process.env.MANAGER_SECRET_KEY || 'default_manager_key_secure_123';
        if (managerSecretKey === validManagerKey) {
            finalRole = 'attraction_manager';
        } else {
            finalRole = 'citizen';
        }
    }

    const user = await User.create({
        name,
        email,
        password,
        role: finalRole,
        phone,
        address,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

module.exports = { authUser, registerUser, getAllUsers };
