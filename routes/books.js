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
    const books = await libraryService.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Count books by author
router.get('/count-books-by-author/:author', async (req, res) => {
  try {
    const count = await libraryService.countBooksByAuthor(req.params.author);
    res.json({ author: req.params.author, count: count });
  } catch (err) {
    res.status(404).json({ message: 'Author not found or has no books' });
  }
});

// Get books and count by author
router.get('/books-and-count-by-author/:author', async (req, res) => {
  try {
    const { books, count } = await libraryService.getBooksAndCountByAuthor(req.params.author);
    res.json({ author: req.params.author, count: count, books: books });
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
    const actualReturnDate = new Date(); // Get the current date as the actual return date

    // Retrieve the book from the database
    const book = await libraryService.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate the fine if the book is overdue
    const fineRatePerDay = 10; // Fine rate is $10 per day (adjust as needed)
    const fineAmount = calculateFine(book.submissionDate, actualReturnDate, fineRatePerDay);

    // Update the book's return status and fine amount
    book.returned = true;
    book.actualReturnDate = actualReturnDate;
    book.fineAmount = fineAmount;

    // Save the updated book information
    const updatedBook = await book.save();
    
    // Respond with the updated book and fine amount
    res.json({ book: updatedBook, fineAmount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Function to calculate the fine
function calculateFine(submissionDate, actualReturnDate, fineRatePerDay) {
  const submissionTimestamp = new Date(submissionDate).getTime();
  const actualReturnTimestamp = new Date(actualReturnDate).getTime();
  const differenceInMilliseconds = actualReturnTimestamp - submissionTimestamp;
  const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  
  if (differenceInDays <= 0) {
    return 0; // No fine if returned on or before submission date
  } else {
    return differenceInDays * fineRatePerDay;
  }
}

module.exports = router;


module.exports = router;
