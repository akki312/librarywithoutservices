const express = require('express');
const router = express.Router();
const libraryService = require('../services/libraryservice');

// Create a book (POST)
router.post('/create', async (req, res) => {
  try {
    const newBook = await libraryService.createBook(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book (POST)
router.post('/update/:id', async (req, res) => {
  try {
    const updatedBook = await libraryService.updateBook(req.params.id, req.body);
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book (POST)
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
router.get('/:id', async (req, res) => {
  try {
    const book = await libraryService.getBookById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
