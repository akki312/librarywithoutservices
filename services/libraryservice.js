// services/libraryservice.js

const Book = require('../models/book');

async function createBook(data) {
  const book = new Book(data);
  return await book.save();
}

async function updateBook(id, data) {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error('Book not found');
  }
  
  Object.assign(book, data);
  return await book.save();
}

async function deleteBook(id) {
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    throw new Error('Book not found');
  }
  return { message: 'Book deleted' };
}

async function getAllBooks() {
  return await Book.find();
}

async function getBookById(id) {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error('Book not found');
  }
  return book;
}

async function countBooksByAuthor(author) {
  const count = await Book.aggregate([
    { $match: { author } },
    { $count: "totalBooks" }
  ]);
  return count.length ? count[0].totalBooks : 0;
}

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookById,
  countBooksByAuthor
};
