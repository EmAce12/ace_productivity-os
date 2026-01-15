const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  timeEstimate: {
    type: String, // e.g. "30m", "1h", "2h30m"
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: { // optional later for multi-user
    type: String
  }
});

module.exports = mongoose.model('Todo', todoSchema);