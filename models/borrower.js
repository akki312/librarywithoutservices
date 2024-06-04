const mongoose = require('mongoose');
const { Schema } = mongoose;

const borrowerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  assignedBooks: [{
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book', // Assuming you have a Book model
      required: true
    },
    assignedDate: {
      type: Date,
      required: true
    }
  }],
  // Add other necessary fields and methods
});

// Method to calculate fine
borrowerSchema.methods.calculateFine = function (bookId) {
  const assignedBook = this.assignedBooks.find(book => book.bookId.equals(bookId));
  if (!assignedBook) {
    throw new Error('Book not assigned to this borrower');
  }

  const assignedDate = assignedBook.assignedDate;
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - assignedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  const finePerDay = 1; // Example fine rate
  const gracePeriod = 14; // Example grace period of 14 days

  return diffDays > gracePeriod ? (diffDays - gracePeriod) * finePerDay : 0;
};

const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
