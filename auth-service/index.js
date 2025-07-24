const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute'); // ⬅️ import your routes

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json()); // ⬅️ important for POST body parsing

// Mount routes
app.use('/', authRoutes); // ⬅️ now /signup and /login will work

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'auth-service is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
