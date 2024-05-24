const Book = require('../models/book');
const Borrower = require('../models/borrower');

async function createBook(bookData) {
  const book = new Book(bookData);
  return await book.save();
}

async function updateBook(id, updateData) {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error('Book not found');
  }

  Object.assign(book, updateData);

  // Calculate fine if dateReturn and dateTaken are present
  if (book.dateTaken && book.dateReturn) {
    const fine = calculateFine(book.dateTaken, book.dateReturn);
    book.fine = fine;
  }

  return await book.save();
}

async function deleteBook(id) {
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    throw new Error('Book not found');
  }
  return { message: 'Book deleted' };
}

async function getAllBooks() {
  return await Book.find().populate('borrower');  // Populate borrower details
}

async function getBookById(id) {
  const book = await Book.findById(id).populate('borrower');  // Populate borrower details
  if (!book) {
    throw new Error('Book not found');
  }
  if (!book.availability) {
    throw new Error('Book is not available');
  }
  return book;
}

async function countBooksByAuthor(author) {
  return await Book.countDocuments({ author });
}

async function getBooksAndCountByAuthor(author) {
  const books = await Book.find({ author }).populate('borrower');
  const count = books.length;
  return { books, count };
}

async function countBooksByAuthorAndCategory(author) {
  return await Book.aggregate([
    { $match: { author } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);
}

function calculateFine(dateTaken, dateReturn) {
  const fineRate = 1; // Define the fine rate per day
  const borrowDuration = (new Date(dateReturn) - new Date(dateTaken)) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(borrowDuration - 7) * fineRate); // Assuming 14 days grace period
}

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookById,
  countBooksByAuthor,
  getBooksAndCountByAuthor,
  countBooksByAuthorAndCategory,
  calculateFine
};
