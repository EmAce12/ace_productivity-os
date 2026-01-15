const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- NEW IMPORT ---
const goalRoutes = require('./routes/goalRoutes'); 

const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focus-app';

mongoose.connect(MONGODB_URI)
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- NEW ROUTE MIDDLEWARE ---
app.use('/api/goals', goalRoutes); 
app.use('/api/todos', todoRoutes);


app.get('/', (req, res) => {
  res.send('Focus App API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server spinning on port ${PORT}`);
});