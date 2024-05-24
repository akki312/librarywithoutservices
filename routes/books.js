const express = require('express');
const router = express.Router();
const libraryService = require('../services/libraryservice');

router.get('/count-books-by-author/:author', async (req, res) => {
  try {
    const authorName = req.params.author;
    const count = await libraryService.countBooksByAuthor(authorName);
    res.json({ author: authorName, count: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});








//Create a book 
router.post('/insertbooks', async (req, res) => {
  try {
    const newBook = await libraryService.createBook(req.body);
    res.status(200).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book 
router.post('/bookupdation/:id', async (req, res) => {
  try {
    const updatedBook = await libraryService.updateBook(req.params.id, req.body);
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book 
router.post('/removalofbooks/:id', async (req, res) => {
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
