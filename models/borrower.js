const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowerSchema = new Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  fine: { type: Number, default: 0 },
  borrowedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});

module.exports = mongoose.model('Borrower', borrowerSchema);
