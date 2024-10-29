const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const crimeRoutes = require('./routes/crimeRoute');
const  policeRoutes  = require('./routes/policeRoutes')
const cors = require('cors');
const path = require('path');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));


app.use('/api/auth', authRoutes);
app.use('/api/crime', crimeRoutes);
app.use('/api/police', policeRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
