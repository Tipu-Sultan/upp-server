const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const crimeRoutes = require('./routes/crimeRoute');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/crime', crimeRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
