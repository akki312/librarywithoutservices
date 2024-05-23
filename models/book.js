// models/book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publishedDate: {
    type: Date,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  dateTaken: {
    type: Date,
    required: false
  },
  dateReturn: {
    type: Date,
    required: false
  },
  timeOfTaken: {
    type: String,
    required: false
  },
  timeOfReturn: {
    type: String,
    required: false
  },
  personName: {
    type: String,
    required: false
  },
  availability: {
    type: Boolean,
    required: true,
    default: true // Assume books are available by default
  }
});

module.exports = mongoose.model('Book', bookSchema);
