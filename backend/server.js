const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const billRoutes = require('./routes/billRoutes');
const trafficRoutes = require('./routes/trafficRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const reportRoutes = require('./routes/reportRoutes');
const newsRoutes = require('./routes/newsRoutes');
const attractionRoutes = require('./routes/attractionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const contactRoutes = require('./routes/contactRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
