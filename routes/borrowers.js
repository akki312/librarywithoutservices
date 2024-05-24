const express = require('express');
const router = express.Router();
const borrowerService = require('../services/borrowerservice');
const borrowerSchema = require('../models/borrower');

// Create a borrower (POST)
router.post('/create', async (req, res) => {
  try {
    const newBorrower = await borrowerService.createBorrower(req.body);
    res.status(201).json(newBorrower);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a borrower by ID
router.get('/:id', async (req, res) => {
  try {
    const borrower = await borrowerService.getBorrowerById(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.json(borrower);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
