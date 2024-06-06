const express = require('express');
const router = express.Router();
const libraryService = require('../services/libraryservice');
const errorHandler = require('../middleware/errorHandler');

// Create a book (POST)
router.post('/createbooks', async (req, res) => {
  try {
    const newBook = await libraryService.fnccreateBook(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book (PATCH)
router.patch('/updatebooks/:id', async (req, res) => {
  try {
    const updatedBook = await libraryService.fncupdateBook(req.params.id, req.body);
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book (DELETE)
router.delete('/deletebooks/:id', async (req, res) => {
  try {
    const result = await libraryService.fncdeleteBook(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one book by ID
router.get('/getbookbyid/:id', async (req, res) => {
  try {
    const book = await libraryService.fncgetBookById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all books
router.get('/getallbooks', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'title' } = req.query;
    const books = await libraryService.fncgetAllBooks(page, limit, sort);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Count books by author
router.get('/countBooksByAuthor', async (req, res) => {
  try {
    const count = await libraryService.fnccountBooksByAuthor(req.params.author);
    res.json({ author: req.params.author, count });
  } catch (err) {
    res.status(404).json({ message: 'Author not found or has no books' });
  }
});

// Get books and count by author
router.get('/books-and-count-by-author/:author', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'title' } = req.query;
    const { books, count } = await libraryService.fncgetBooksAndCountByAuthor(req.params.author, page, limit, sort);
    res.json({ author: req.params.author, count, books });
  } catch (err) {
    res.status(404).json({ message: 'Author not found or has no books' });
  }
});

// Count books by author and category
router.get('/count-books-by-author-and-category/:author', async (req, res) => {
  try {
    const result = await libraryService.fnccountBooksByAuthorAndCategory(req.params.author);
    res.json({ author: req.params.author, categories: result });
  } catch (err) {
    res.status(404).json({ message: 'Author not found or has no books' });
  }
});

// Return a book (POST)
router.post('/returningofbooks/:id', async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const actualReturnDate = new Date();

    const book = await libraryService.fncgetBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    if (!book.borrower || typeof book.borrower !== 'object') {
      throw new Error('Borrower information is missing or invalid');
    }

    const fineAmount = libraryService.fnccalculateFine(book.submissionDate, actualReturnDate, book.category, book.borrower);

    book.returned = true;
    book.actualReturnDate = actualReturnDate;
    book.fineAmount = fineAmount;

    const updatedBook = await libraryService.fncupdateBook(bookId, book);

    res.json({ book: updatedBook, fineAmount });
  } catch (err) {
    console.error(`Error returning book: ${err.message}`);
    next(err);
  }
});

// Calculate fine by borrowing ID (POST)
router.post('/calculatefine/:borrowingId', async (req, res, next) => {
  try {
    const borrowingId = req.params.borrowingId;
    const fineAmount = await libraryService.fnccalculateFineByBorrowingId(borrowingId);
    res.json({ borrowingId, fineAmount });
  } catch (err) {
    console.error(`Error calculating fine: ${err.message}`);
    next(err);
  }
});

router.get('/inventory', async (req, res) => {
  try {
    const books = await bookService.getAllBooksInInventory();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new book to inventory
router.post('/inventory', async (req, res) => {
  try {
    const newBook = await bookService.addBookToInventory(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update book quantity in inventory
router.patch('/inventory/:bookId', async (req, res) => {
  try {
    const updatedBook = await bookService.updateBookQuantity(req.params.bookId, req.body.quantity);
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Update one book (PATCH)
router.patch('/update-one', async (req, res) => {
  try {
    const { filter, updateData } = req.body;
    const updatedBook = await libraryService.fncupdateOneBook(filter, updateData);
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update many books (PATCH)
router.patch('/update-many', async (req, res) => {
  try {
    const { filter, updateData } = req.body;
    const result = await libraryService.fncupdateManyBooks(filter, updateData);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.use(errorHandler);
module.exports = router;
