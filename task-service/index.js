const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/tasks', taskRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskdb');

app.listen(5002, () => {
    console.log('Task service is running on port 5002');
});