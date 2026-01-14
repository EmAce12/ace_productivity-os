const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// POST: Save a new goal when "Start Focus" is clicked
router.post('/', async (req, res) => {
  try {
    const { title, duration } = req.body;
    const newGoal = new Goal({ title, duration });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: Fetch the last 5 goals to show history on the setup screen
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 }).limit(5);
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;