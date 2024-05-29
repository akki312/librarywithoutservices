// models/borrower.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  borrowedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  fine: { type: Number, default: 0 }
});

const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
