const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const tagRoutes = require('./routes/tagRoutes');


const app = express();
const mongoDbUrl = process.env.DATABASE_URL;

app.use(express.json());
app.use('/api', tagRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);

mongoose.connect(mongoDbUrl);
const database = mongoose.connection;

database.on('error', (error) => console.error(error));

database.once('connected', () => console.log('Connected to Database'));
