// routes/borrower.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const borrowerService = require('../services/borrowerservice');
const Borrower = require('../models/borrower');

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

// Get all borrowers
router.get('/', async (req, res) => {
  try {
    const borrowers = await borrowerService.getAllBorrowers();
    res.json(borrowers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Calculate fine for a borrower
router.post('/calculate-fine', async (req, res) => {
  try {
    const { borrowerId, bookId } = req.body;
    const fine = await borrowerService.calculateFine(borrowerId, bookId);
    res.json({ borrowerId, bookId, fine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a borrower by ID
router.post('/update/:id', async (req, res) => {
  try {
    const updatedBorrower = await borrowerService.updateBorrower(req.params.id, req.body);
    res.json(updatedBorrower);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a borrowed book to a borrower
router.post('/:id/borrow-book', async (req, res) => {
  try {
    const borrowerId = req.params.id;
    const { bookId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(borrowerId)) {
      return res.status(400).json({ message: 'Invalid borrower ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const borrower = await Borrower.findById(borrowerId);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    borrower.borrowedBooks.push(bookId);
    await borrower.save();

    res.json(borrower);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
