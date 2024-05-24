const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date },
  isbn: { type: String, required: true },
  genre: { type: String },
  dateTaken: { type: Date },
  dateReturn: { type: Date },
  timeOfTaken: { type: String },
  timeOfReturn: { type: String },
  personName: { type: String },
  availability: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('Book', bookSchema);
