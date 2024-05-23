const express = require('express');
const router = express.Router();
const libraryService = require('../services/libraryservice');

//Create a book 
router.post('/create', async (req, res) => {
  try {
    const newBook = await libraryService.createBook(req.body);
    res.status(200).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book 
router.post('/update/:id', async (req, res) => {
  try {
    const updatedBook = await libraryService.updateBook(req.params.id, req.body);
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book 
router.post('/delete/:id', async (req, res) => {
  try {
    const result = await libraryService.deleteBook(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await libraryService.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one book by ID
router.get('/verifyBookById', async (req, res) => {
  try {
    const data = await libraryService.getBookById(req.params.id);
    res.status(200).send(data)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
