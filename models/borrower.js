const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssignedBookSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
  assignedDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true }, // Due date field
  returnDate: { type: Date }, // Return date field
});

const BorrowerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  assignedBooks: [AssignedBookSchema],
});

BorrowerSchema.methods.calculateFine = function(bookId) {
  const assignedBook = this.assignedBooks.find(book => book.bookId.equals(bookId));
  if (!assignedBook) {
    throw new Error('Book not assigned to this borrower');
  }

  if (!assignedBook.returnDate) {
    assignedBook.returnDate = new Date(); // Use current date if return date is not set
  }

  const dueDate = assignedBook.dueDate;
  const returnDate = assignedBook.returnDate;
  const overdueDays = Math.max(0, Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)));
  const fineRate = 0.50; // Example fine rate per day

  return overdueDays * fineRate;
};

const Borrower = mongoose.model('Borrower', BorrowerSchema);

module.exports = Borrower;
