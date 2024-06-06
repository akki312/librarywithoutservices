// models/Borrower.js
const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
  name: String,
  email: String,
  assignedBooks: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    assignedDate: Date,
    dueDate: Date,
  }],
  fine: { type: Number, default: 0 },
  reviews: [{
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
});


borrowerSchema.methods.calculateFine = function(bookId) {
  const assignedBook = this.assignedBooks.find(book => book.bookId.equals(bookId));
  if (!assignedBook) return 0;

  const today = new Date();
  const dueDate = assignedBook.dueDate;
  const overdueDays = Math.max(0, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)));
  
  console.log(`Today's date: ${today}`);
  console.log(`Due date: ${dueDate}`);
  console.log(`Overdue days: ${overdueDays}`);
  
  const fineRate = 1; // Define your fine rate here
  return overdueDays * fineRate;
};



module.exports = mongoose.model('Borrower', borrowerSchema);
