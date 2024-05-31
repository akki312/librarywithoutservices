const Book = require('../models/book');
const Borrower = require('../models/borrower');

async function createBook(bookData) {
  try {
    // Validate book data (example: checking required fields)
    validateBookData(bookData);

    const book = new Book(bookData);
    const savedBook = await book.save();
    
    Logger.info('Book created', { bookId: savedBook._id });
    return savedBook;
  } catch (error) {
    Logger.error('Error creating book', { error });
    throw error;
  }
}

async function updateBook(id, updateData) {
  try {
    const book = await Book.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    Object.assign(book, updateData);

    // Calculate fine if dateReturn and dateTaken are present
    if (book.dateTaken && book.dateReturn) {
      const fine = calculateFine(book.dateTaken, book.dateReturn, book.category, book.borrower);
      book.fine = fine;
    }

    const updatedBook = await book.save();
    Logger.info('Book updated', { bookId: updatedBook._id });
    return updatedBook;
  } catch (error) {
    Logger.error('Error updating book', { error });
    throw error;
  }
}

async function deleteBook(id) {
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      throw new Error('Book not found');
    }

    Logger.info('Book deleted', { bookId: id });
    return { message: 'Book deleted' };
  } catch (error) {
    Logger.error('Error deleting book', { error });
    throw error;
  }
}

async function getAllBooks(page = 1, limit = 10, sort = 'title') {
  try {
    const books = await Book.find()
      .populate('borrower') // Populate borrower details
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBooks = await Book.countDocuments();
    return { books, totalBooks, currentPage: page, totalPages: Math.ceil(totalBooks / limit) };
  } catch (error) {
    Logger.error('Error fetching all books', { error });
    throw error;
  }
}

async function getBookById(id) {
  try {
    const book = await Book.findById(id).populate('borrower'); // Populate borrower details
    if (!book) {
      throw new Error('Book not found');
    }
    if (!book.availability) {
      throw new Error('Book is not available');
    }

    return book;
  } catch (error) {
    Logger.error('Error fetching book by ID', { error });
    throw error;
  }
}

async function countBooksByAuthor(author) {
  try {
    return await Book.countDocuments({ author });
  } catch (error) {
    Logger.error('Error counting books by author', { error });
    throw error;
  }
}

async function getBooksAndCountByAuthor(author, page = 1, limit = 10, sort = 'title') {
  try {
    const books = await Book.find({ author })
      .populate('borrower')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Book.countDocuments({ author });
    return { books, count, currentPage: page, totalPages: Math.ceil(count / limit) };
  } catch (error) {
    Logger.error('Error fetching books and count by author', { error });
    throw error;
  }
}

async function countBooksByAuthorAndCategory(author) {
  try {
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
  } catch (error) {
    Logger.error('Error counting books by author and category', { error });
    throw error;
  }
}

function calculateFine(dateTaken, dateReturn, category, borrower) {
  const baseFineRate = 1; // Define the base fine rate per day
  const categoryFineRate = getCategoryFineRate(category); // Function to get fine rate based on category
  const repeatOffenderRate = borrower.isRepeatOffender ? 1.5 : 1; // Increase fine rate for repeat offenders

  const borrowDuration = (new Date(dateReturn) - new Date(dateTaken)) / (1000 * 60 * 60 * 24);
  const fine = Math.max(0, Math.ceil(borrowDuration - 7) * baseFineRate * categoryFineRate * repeatOffenderRate); // Assuming 14 days grace period

  return fine;
}

function validateBookData(bookData) {
  if (!bookData.title || !bookData.author) {
    throw new Error('Book title and author are required');
  }
  // Additional validation logic as needed
}

function getCategoryFineRate(category) {
  // Logic to determine fine rate based on book category
  const fineRates = {
    'fiction': 1,
    'non-fiction': 1.2,
    'reference': 1.5,
    'other': 1
  };

  return fineRates[category] || fineRates['other'];
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
