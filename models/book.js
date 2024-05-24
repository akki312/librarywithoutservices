const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  isbn: { type: String, required: true },
  genre: { type: String, required: true },
  dateTaken: { type: Date },
  dateReturn: { type: Date },
  timeOfTaken: { type: String },
  timeOfReturn: { type: String },
  personName: { type: String },  // You might want to remove this if you are using borrower reference
  availability: { type: Boolean, default: true },
  category: { type: String, required: true },
  borrower: { type: Schema.Types.ObjectId, ref: 'Borrower' },  // Add reference to Borrower
  fine: { type: Number, default: 0 }  // Add field for fine
});

module.exports = mongoose.model('Book', bookSchema);
