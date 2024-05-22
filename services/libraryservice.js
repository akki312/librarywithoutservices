// services/libraryService.js
const Book = require('../models/book');

async function createBook(data) {
  const book = new Book(data);
  return await book.save();
}

async function updateBook(id, data) {
  const book = await Book.findById(id);
  if (!book) throw new Error('Book not found');

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      book[key] = data[key];
    }
  }

  return await book.save();
}

async function deleteBook(id) {
  const book = await Book.findByIdAndDelete(id);
  if (!book) throw new Error('Book not found');
  return { message: 'Book deleted' };
}

async function getAllBooks() {
  return await Book.find();
}

async function getBookById(id) {
  try {
    const book = await Book.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    
    if (!book.available) {
      throw new Error('Book is not available');
    }

    return book;
  } catch (err) {
    throw new Error(err.message);
  }
}


module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookById
};
