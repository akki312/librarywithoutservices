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

// Get one book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await libraryService.getBookById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'title' } = req.query;
    const books = await libraryService.getAllBooks(page, limit, sort);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Count books by author
router.get('/count-books-by-author/:author', async (req, res) => {
  try {
    const count = await libraryService.countBooksByAuthor(req.params.author);
    res.json({ author: req.params.author, count });
  } catch (err) {
    res.status(404).json({ message: 'Author not found or has no books' });
  }
});

// Get books and count by author
router.get('/books-and-count-by-author/:author', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'title' } = req.query;
    const { books, count } = await libraryService.getBooksAndCountByAuthor(req.params.author, page, limit, sort);
    res.json({ author: req.params.author, count, books });
  } catch (err) {
    res.status(404).json({ message: 'Author not found or has no books' });
  }
});

// Count books by author and category
router.get('/count-books-by-author-and-category/:author', async (req, res) => {
  try {
    const result = await libraryService.countBooksByAuthorAndCategory(req.params.author);
    res.json({ author: req.params.author, categories: result });
  } catch (err) {
    res.status(404).json({ message: 'Author not found or has no books' });
  }
});

// Return a book (POST)
router.post('/return/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const actualReturnDate = new Date();

    const book = await libraryService.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const fineAmount = libraryService.calculateFine(book.submissionDate, actualReturnDate, book.category, book.borrower);

    book.returned = true;
    book.actualReturnDate = actualReturnDate;
    book.fineAmount = fineAmount;

    const updatedBook = await book.save();

    res.json({ book: updatedBook, fineAmount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one book (PATCH)
router.patch('/update-one', async (req, res) => {
  try {
    const { filter, updateData } = req.body;
    const updatedBook = await libraryService.updateOneBook(filter, updateData);
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update many books (PATCH)
router.patch('/update-many', async (req, res) => {
  try {
    const { filter, updateData } = req.body;
    const result = await libraryService.updateManyBooks(filter, updateData);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
