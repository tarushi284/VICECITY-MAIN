const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany({ email: { $in: ['admin@example.com', 'manager@example.com'] } });
        console.log('Cleaned up old test users...');

        const users = [
            {
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                phone: '1234567890',
                address: 'Admin HQ'
            },
            {
                name: 'Attraction Manager',
                email: 'manager@example.com',
                password: 'password123',
                role: 'attraction_manager',
                phone: '0987654321',
                address: 'Manager Office'
            }
        ];

        // Using Create to leverage pre-save hooks (hashing)
        for (const user of users) {
            await User.create(user);
        }

        console.log('Privileged Users Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
