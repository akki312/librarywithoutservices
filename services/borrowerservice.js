const Borrower = require('../models/borrower');
const emailService = require('../utils/sendemail');

// Create a new borrower
async function fnccreateBorrower(data) {
  if (!data) {
    throw new Error('Data is required to create a borrower');
  }
  const borrower = new Borrower(data);
  await borrower.save();

  // Send a welcome email to the new borrower
  const emailText = `Dear ${borrower.name},\n\nWelcome to our library. Your borrower ID is ${borrower._id}.\n\nThank you,\nLibrary Team`;
  await emailService.sendEmail(borrower.email, 'Welcome to the Library', emailText);

  return borrower;
}

// Get borrower by ID
async function fncgetBorrowerById(id) {
  if (!id) {
    throw new Error('Borrower ID is required');
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
  if (!id || !data) {
    throw new Error('Borrower ID and data are required');
  }
  const borrower = await Borrower.findByIdAndUpdate(id, data, { new: true });
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  return borrower;
}

// Assign a book to a borrower
async function fncassignBookToBorrower(borrowerId, bookId) {
  if (!borrowerId || !bookId) {
    throw new Error('Borrower ID and Book ID are required');
  }
  const borrower = await Borrower.findById(borrowerId);
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  borrower.assignedBooks.push({ bookId, assignedDate: new Date() });
  await borrower.save();
  return borrower;
}

// Check in a book
async function fnccheckInBook(borrowerId, bookId) {
  if (!borrowerId || !bookId) {
    throw new Error('Borrower ID and Book ID are required');
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
  if (!borrowerId || !bookId) {
    throw new Error('Borrower ID and Book ID are required');
  }
  const borrower = await Borrower.findById(borrowerId);
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  console.log('Assigned Books:', borrower.assignedBooks); // Log assigned books for debugging
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
