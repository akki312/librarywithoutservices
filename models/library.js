const mongoose = require('mongoose');
const bookSchema = require('./book').schema; // Import the book schema

const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  books: [bookSchema] // Define an array of books
});

module.exports = mongoose.model('Library', librarySchema);
