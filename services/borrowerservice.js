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

// Submit review function
async function submitReview(borrowerId, rating, comment) {
  const borrower = await Borrower.findById(borrowerId);
  if (!borrower) {
    throw new Error('Borrower not found');
  }

  // Add the review to the borrower document
  borrower.reviews.push({ rating, comment });
  await borrower.save();

  return borrower;
}

// Check in a book
async function fnccheckInBook(borrowerId, bookId) {
  const borrower = await Borrower.findById(borrowerId).populate('assignedBooks.bookId').exec();
  if (!borrower) {
    throw new Error('Borrower not found');
  }
  const assignedBook = borrower.assignedBooks.find(book => book.bookId.equals(bookId));
  if (!assignedBook) {
    throw new Error('Book not assigned to this borrower');
  }

  // Calculate fine
  const fine = borrower.calculateFine(bookId);
  borrower.fine += fine;

  console.log(`Fine calculated: ${fine}`);

  // Remove the book from assignedBooks
  borrower.assignedBooks = borrower.assignedBooks.filter(book => !book.bookId.equals(bookId));
  await borrower.save();

  return { borrower, fine };
}

// Aggregate borrowers
async function fncaggregateBorrowers() {
  const results = await Borrower.aggregate([
    {
      $unwind: '$assignedBooks'
    },
    {
      $lookup: {
        from: 'books',
        localField: 'assignedBooks.bookId',
        foreignField: '_id',
        as: 'bookDetails'
      }
    },
    {
      $group: {
        _id: '$name',
        totalBooksBorrowed: { $sum: 1 },
        averageFine: { $avg: '$fine' }
      }
    }
  ]);
  return results;
}

async function fncdeepAggregateBorrowers() {
  try {
    const results = await Borrower.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'assignedBooks.bookId',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      {
        $unwind: {
          path: '$bookDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$name',
          totalBooksBorrowed: { $sum: 1 },
          averageFine: { $avg: '$fine' },
          books: { $push: '$bookDetails' }
        }
      },
      {
        $addFields: {
          totalFine: { $multiply: ['$averageFine', '$totalBooksBorrowed'] }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          totalBooksBorrowed: 1,
          averageFine: 1,
          totalFine: 1,
          books: {
            title: 1,
            genre: 1,
            publishedDate: 1
          }
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);
    return results;
  } catch (error) {
    throw new Error(`Error during deep aggregation: ${error.message}`);
  }
}



module.exports = {
  fnccreateBorrower,
  fncgetBorrowerById,
  fncgetAllBorrowers,
  fncupdateBorrower,
  fncassignBookToBorrower,
  fnccheckInBook,
  fncaggregateBorrowers,
  submitReview,
  fncdeepAggregateBorrowers
};
