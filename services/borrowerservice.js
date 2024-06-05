const mongoose = require('mongoose');
const Borrower = require('../models/borrower');
const Book = require('../models/book'); // Assuming you have a Book model
const emailService = require('../utils/sendemail');
const MAX_BORROWING_DAYS = 5;

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
  const borrower = await Borrower.findById(id).populate('assignedBooks.bookId').exec();
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  return borrower;
}

// Get all borrowers
async function fncgetAllBorrowers() {
  return await Borrower.find({}).populate('assignedBooks.bookId').exec();
}

// Update a borrower
async function fncupdateBorrower(id, data) {
  const borrower = await Borrower.findByIdAndUpdate(id, data, { new: true });
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  return borrower;
}

// Assign a book to a borrower
async function fncassignBookToBorrower(borrowerId, bookId) {
  const borrower = await Borrower.findById(borrowerId).populate('assignedBooks.bookId').exec();
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

  // Populate book details
  await borrower.populate('assignedBooks.bookId').execPopulate();

  // Replace bookId with book names in the response
  const assignedBooksWithNames = borrower.assignedBooks.map(book => ({
    bookName: book.bookId.name, // Assuming the Book model has a 'name' field
    assignedDate: book.assignedDate,
    dueDate: book.dueDate
  }));

  // Return the borrower with assigned book names
  return {
    _id: borrower._id,
    name: borrower.name,
    contact: borrower.contact,
    email: borrower.email,
    fine: borrower.fine,
    assignedBooks: assignedBooksWithNames
  };
}

// Check in a book
async function fnccheckInBook(borrowerId, bookId) {
  const borrower = await Borrower.findById(borrowerId).populate('assignedBooks.bookId').exec();
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  borrower.assignedBooks = borrower.assignedBooks.filter(book => !book.bookId.equals(bookId));
  await borrower.save();
  return borrower;
}

// Calculate fine for a borrower
async function fnccalculateFine(borrowerId, bookId) {
  const borrower = await Borrower.findById(borrowerId).populate('assignedBooks.bookId').exec();
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
