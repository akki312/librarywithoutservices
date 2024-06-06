const express = require('express');
const router = express.Router();
const borrowerService = require('../services/borrowerservice');

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
router.get('/borrowerid/:id', async (req, res) => {
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
router.put('/updateborrower/:id', async (req, res) => {
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
router.post('/:borrowerId/Assign/:bookId', async (req, res) => {
  try {
    const borrower = await borrowerService.fncassignBookToBorrower(req.params.borrowerId, req.params.bookId);
    res.json(borrower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check in a book
router.post('/:borrowerId/Checkin/:bookId', async (req, res) => {
  try {
    const { borrowerId, bookId } = req.params;
    const { borrower, fine } = await borrowerService.fnccheckInBook(borrowerId, bookId);
    res.json({ borrower, fine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Calculate fine for a borrower
/*router.post('/:borrowerId/fine/:bookId', async (req, res) => {
  try {
    const fine = await borrowerService.fnccalculateFine(req.params.borrowerId, req.params.bookId);
    res.json({ fine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/

module.exports = router;
