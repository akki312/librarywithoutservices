const express = require('express');
const router = express.Router();
const Book = require('../models/book'); // Adjust the path if needed

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a book (POST)
router.post('/create', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishedDate: req.body.publishedDate,
    isbn: req.body.isbn,
    genre: req.body.genre
  });
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book (POST)
router.post('/update/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.publishedDate = req.body.publishedDate || book.publishedDate;
    book.isbn = req.body.isbn || book.isbn;
    book.genre = req.body.genre || book.genre;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book (POST)
router.post('/delete/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
