const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                console.error('Auth Failed: Invalid Token Signature (User needs to re-login)');
            } else if (error.name === 'TokenExpiredError') {
                console.error('Auth Failed: Token Expired');
            } else {
                console.error('Auth Middleware Error:', error.message);
            }
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const attractionManager = (req, res, next) => {
    if (req.user && (req.user.role === 'attraction_manager' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an attraction manager' });
    }
};

module.exports = { protect, admin, attractionManager };
