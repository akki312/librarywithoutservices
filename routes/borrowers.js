const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const borrowerService = require('../services/borrowerservice');

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  const { id, borrowerId, bookId } = req.params;

  if (id && !isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  if (borrowerId && !isValidObjectId(borrowerId)) {
    return res.status(400).json({ message: 'Invalid borrower ID format' });
  }
  if (bookId && !isValidObjectId(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID format' });
  }

  next();
}

// Apply the middleware to routes that use borrowerId and bookId
router.use('/:borrowerId/*', validateObjectId);
router.use('/:borrowerId/:bookId/*', validateObjectId);

// Create a new borrower
router.post('/newborrower', async (req, res) => {
  try {
    const borrower = await borrowerService.fnccreateBorrower(req.body);
    res.status(201).json(borrower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get borrower by ID
router.get('/borrowerid/:id', validateObjectId, async (req, res) => {
  try {
    const borrower = await borrowerService.fncgetBorrowerById(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.json(borrower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all borrowers
router.get('/listofborrowers', async (req, res) => {
  try {
    const borrowers = await borrowerService.fncgetAllBorrowers();
    res.json(borrowers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a borrower
router.put('/updateborrower/:id', validateObjectId, async (req, res) => {
  try {
    const borrower = await borrowerService.fncupdateBorrower(req.params.id, req.body);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.json(borrower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign a book to a borrower
router.post('/:borrowerId/assign/:bookId', async (req, res) => {
  try {
    const borrowerId = req.params.borrowerId;
    const bookId = req.params.bookId;

    // Assign the book to the borrower
    const borrower = await borrowerService.fncassignBookToBorrower(borrowerId, bookId);

    // Populate the book field in the borrower document
    await borrower.populate('borrowedBooks').execPopulate();

    res.json(borrower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Check in a book
router.post('/:borrowerId/checkin/:bookId', async (req, res) => {
  try {
    const borrowerId = req.params.borrowerId;
    const bookId = req.params.bookId;

    // Retrieve borrower's information
    const borrower = await borrowerService.fncgetBorrowerById(borrowerId);
    if (!borrower) {
      throw new Error('Borrower not found');
    }

    // Retrieve book's information
    const book = await libraryService.fncgetBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    // Calculate fine amount
    const fineAmount = calculateFine(book.submissionDate, new Date(), book.category, borrower);
    
    // Update book's status
    book.returned = true;
    book.actualReturnDate = new Date();
    await libraryService.fncupdateBook(bookId, book);

    // Optionally, update borrower's fine amount
    borrower.fine += fineAmount;
    await borrowerService.fncupdateBorrower(borrowerId, borrower);

    res.json({ borrower, fineAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Calculate fine for a borrower
router.post('/:borrowerId/fine/:bookId', async (req, res) => {
  try {
    const fine = await borrowerService.fnccalculateFine(req.params.borrowerId, req.params.bookId);
    res.json({ fine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify book assignments
router.get('/:borrowerId/verifyAssignments', async (req, res) => {
  try {
    const borrower = await borrowerService.fncgetBorrowerById(req.params.borrowerId);
    res.json({ assignedBooks: borrower.assignedBooks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
