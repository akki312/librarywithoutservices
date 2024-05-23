// services/libraryService.js
const Book = require('../models/book');
const mongoose = require('mongoose');

const objectId = require("mongodb").ObjectId;


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
    // const objectId = new mongoose.Types.ObjectId(id);
    const book = await Book.findById({_id: new objectId(id),available:true});
    if (book) {
      return {message:'Book is available'};
    }
    else{
      return {message:'Book not  available'}
    }
     
  } catch (err) {
    throw err;
  }
}


module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookById
};
