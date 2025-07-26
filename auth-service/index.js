const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute'); // ⬅️ import your routes
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoute'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig'); // ⬅️ import Swagger config


// Load environment variables from .env file
dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Create an Express application
const app = express();
app.use('/admin', adminRoutes); // ⬅️ mount admin routes

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});


//Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // ⬅️ setup Swagger UI



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
  console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
