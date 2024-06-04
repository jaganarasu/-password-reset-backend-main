//server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./MongoDB/mongoDBconfig');
const routes = require('./Routes/Routes');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming request bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 4000;

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}/`);
});
