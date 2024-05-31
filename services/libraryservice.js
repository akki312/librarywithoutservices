const Book = require('../models/book');

async function fnccreateBook(bookData) {
  try {
    validateBookData(bookData);

    const book = new Book(bookData);
    const savedBook = await book.save();
    return savedBook;
  } catch (error) {
    throw error;
  }
}

async function fncupdateBook(id, updateData) {
  try {
    const book = await Book.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    Object.assign(book, updateData);

    if (book.dateTaken && book.dateReturn) {
      const fine = fnccalculateFine(book.dateTaken, book.dateReturn, book.category, book.borrower);
      book.fine = fine;
    }

    const updatedBook = await book.save();
    return updatedBook;
  } catch (error) {
    throw error;
  }
}

async function fncdeleteBook(id) {
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      throw new Error('Book not found');
    }

    return { message: 'Book deleted' };
  } catch (error) {
    throw error;
  }
}

async function fncgetAllBooks(page = 1, limit = 10, sort = 'title') {
  try {
    const books = await Book.find()
      .populate('borrower')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBooks = await Book.countDocuments();
    return { books, totalBooks, currentPage: page, totalPages: Math.ceil(totalBooks / limit) };
  } catch (error) {
    throw error;
  }
}

async function fncgetBookById(id) {
  try {
    const book = await Book.findById(id).populate('borrower');
    if (!book) {
      throw new Error('Book not found');
    }
    if (!book.availability) {
      throw new Error('Book is not available');
    }

    return book;
  } catch (error) {
    throw error;
  }
}

async function fnccountBooksByAuthor(author) {
  try {
    return await Book.countDocuments({ author });
  } catch (error) {
    throw error;
  }
}

async function fncgetBooksAndCountByAuthor(author, page = 1, limit = 10, sort = 'title') {
  try {
    const books = await Book.find({ author })
      .populate('borrower')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Book.countDocuments({ author });
    return { books, count, currentPage: page, totalPages: Math.ceil(count / limit) };
  } catch (error) {
    throw error;
  }
}

async function fnccountBooksByAuthorAndCategory(author) {
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
    throw error;
  }
}

async function fncupdateOneBook(filter, updateData) {
  try {
    const updatedBook = await Book.findOneAndUpdate(filter, updateData, { new: true });
    if (!updatedBook) {
      throw new Error('Book not found');
    }
    return updatedBook;
  } catch (error) {
    throw error;
  }
}

async function fncupdateManyBooks(filter, updateData) {
  try {
    const result = await Book.updateMany(filter, updateData);
    return { message: `${result.nModified} book(s) updated` };
  } catch (error) {
    throw error;
  }
}

function fnccalculateFine(dateTaken, dateReturn, category, borrower) {
  const baseFineRate = 1;
  const categoryFineRate = getCategoryFineRate(category);
  const repeatOffenderRate = borrower.isRepeatOffender ? 1.5 : 1;

  const borrowDuration = (new Date(dateReturn) - new Date(dateTaken)) / (1000 * 60 * 60 * 24);
  const fine = Math.max(0, Math.ceil(borrowDuration - 7) * baseFineRate * categoryFineRate * repeatOffenderRate);

  return fine;
}

function validateBookData(bookData) {
  if (!bookData.title || !bookData.author) {
    throw new Error('Book title and author are required');
  }
}

function getCategoryFineRate(category) {
  const fineRates = {
    'fiction': 1,
    'non-fiction': 1.2,
    'reference': 1.5,
    'other': 1
  };

  return fineRates[category] || fineRates['other'];
}

module.exports = {
  fnccreateBook,
  fncupdateBook,
  fncdeleteBook,
  fncgetAllBooks,
  fncgetBookById,
  fnccountBooksByAuthor,
  fncgetBooksAndCountByAuthor,
  fnccountBooksByAuthorAndCategory,
  fnccalculateFine,
  fncupdateOneBook,
  fncupdateManyBooks
};
