const mongoose = require('mongoose');
const Borrower = require('../models/borrower');
const emailService = require('../utils/sendemail');
const MAX_BORROWING_DAYS = 14;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Create a new borrower
async function fnccreateBorrower(data) {
  const borrower = new Borrower(data);
  await borrower.save();

  const emailText = `Dear ${borrower.name},\n\nWelcome to our library. Your borrower ID is ${borrower._id}.\n\nThank you,\nLibrary Team`;
  await emailService.sendEmail(borrower.email, 'Welcome to the Library', emailText);

  return borrower;
}

// Get borrower by ID
async function fncgetBorrowerById(id) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid borrower ID');
  }
  const borrower = await Borrower.findById(id);
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  return borrower;
}

// Get all borrowers
async function fncgetAllBorrowers() {
  return await Borrower.find({});
}

// Update a borrower
async function fncupdateBorrower(id, data) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid borrower ID');
  }
  const borrower = await Borrower.findByIdAndUpdate(id, data, { new: true });
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  return borrower;
}

// Assign a book to a borrower
async function fncassignBookToBorrower(borrowerId, bookId) {
  if (!isValidObjectId(borrowerId) || !isValidObjectId(bookId)) {
    throw new Error('Invalid borrower ID or book ID');
  }

  const borrower = await Borrower.findById(borrowerId);
  if (!borrower) {
    throw new Error('Borrower not found');
  }

  const alreadyAssigned = borrower.assignedBooks.some(book => book.bookId.equals(bookId));
  if (alreadyAssigned) {
    return { message: 'Book is already assigned to this borrower' };
  }

  const assignedDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(assignedDate.getDate() + MAX_BORROWING_DAYS);

  borrower.assignedBooks.push({ bookId, assignedDate, dueDate });
  await borrower.save();

  return borrower;
}
// Check in a book
async function fnccheckInBook(borrowerId, bookId) {
  if (!isValidObjectId(borrowerId) || !isValidObjectId(bookId)) {
    throw new Error('Invalid borrower ID or book ID');
  }
  const borrower = await Borrower.findById(borrowerId);
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  borrower.assignedBooks = borrower.assignedBooks.filter(book => !book.bookId.equals(bookId));
  await borrower.save();
  return borrower;
}

// Calculate fine for a borrower
async function fnccalculateFine(borrowerId, bookId) {
  if (!isValidObjectId(borrowerId) || !isValidObjectId(bookId)) {
    throw new Error('Invalid borrower ID or book ID');
  }
  const borrower = await Borrower.findById(borrowerId);
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  const assignedBook = borrower.assignedBooks.find(book => book.bookId.equals(bookId));
  if (!assignedBook) {
    throw new Error('Book not assigned to this borrower');
  }
  const fine = borrower.calculateFine(bookId);
  return fine;
}

module.exports = {
  fnccreateBorrower,
  fncgetBorrowerById,
  fncgetAllBorrowers,
  fncupdateBorrower,
  fncassignBookToBorrower,
  fnccheckInBook,
  fnccalculateFine,
};
