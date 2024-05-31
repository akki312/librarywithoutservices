// services/borrowerservice.js
const Borrower = require('../models/borrower');
const Book = require('../models/book');
const sendBorrowerEmail = require('../utils/sendemail');

async function fnccreateBorrower(borrowerData) {
  const borrower = new Borrower(borrowerData);
  await borrower.save();
  
  // Send an email notification to the borrower with date and time details
  sendBorrowerEmail(borrower.email, borrower.bookTitle, borrower.dateTaken, borrower.timeTaken);
  
  return borrower;
}
async function fncgetBorrowerById(id) {
  return await Borrower.findById(id);
}

async function fncgetAllBorrowers() {
  return await Borrower.find();
}

async function fnccalculateFine(borrowerId, bookId) {
  const borrower = await Borrower.findById(borrowerId).populate('borrowedBooks.book');
  if (!borrower) {
    throw new Error('Borrower not found');
  }

  const book = borrower.borrowedBooks.find(b => b.book._id.toString() === bookId);
  if (!book) {
    throw new Error('Book not found in borrower records');
  }

  const returnDate = book.dateReturn;
  const currentDate = new Date();

  const timeDiff = currentDate - returnDate;
  const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));

  let fine = 0;
  if (daysLate > 0) {
    fine = daysLate * 1; // Assuming the fine is $1 per day late
  }

  book.fine = fine;
  await borrower.save();

  return fine;
}

async function fncupdateBorrower(id, updatedData) {
  try {
    const borrower = await Borrower.findByIdAndUpdate(id, updatedData, { new: true });
    if (!borrower) {
      throw new Error('Borrower not found');
    }
    return borrower;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function fnccheckInBook(borrowerId, bookId) {
  const borrower = await Borrower.findById(borrowerId);
  if (!borrower) {
    throw new Error('Borrower not found');
  }

  const bookIndex = borrower.borrowedBooks.indexOf(bookId);
  if (bookIndex > -1) {
    borrower.borrowedBooks.splice(bookIndex, 1); // Remove the book from the array
  } else {
    throw new Error('Book not found in borrowed books');
  }

  await borrower.save();
  return borrower;
}

async function fncassignBookToBorrower(borrowerId, bookId) {
  const borrower = await Borrower.findById(borrowerId);
  const book = await Book.findById(bookId);

  if (!borrower) {
    throw new Error('Borrower not found');
  }

  if (!book) {
    throw new Error('Book not found');
  }

  borrower.borrowedBooks.push(bookId);
  await borrower.save();
  return borrower;
}










module.exports = {
  fnccreateBorrower,
  fncgetBorrowerById,
  fncgetAllBorrowers,
  fnccalculateFine,
  fncupdateBorrower,
  fnccheckInBook,
  fncassignBookToBorrower
};
