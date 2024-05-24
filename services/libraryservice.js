const Library = require('../models/library');

async function countBooksByAuthor(authorName) {
  try {
    const count = await Book.countDocuments({ author: authorName });
    return count;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function createLibrary(libraryData) {
  const library = new Library(libraryData);
  return await library.save();
}

async function addBookToLibrary(libraryId, bookData) {
  const library = await Library.findById(libraryId);
  if (!library) {
    throw new Error('Library not found');
  }

  library.books.push(bookData);
  return await library.save();
}

async function getLibraryById(id) {
  const library = await Library.findById(id);
  if (!library) {
    throw new Error('Library not found');
  }
  return library;
}

async function updateLibraryBook(libraryId, bookId, bookData) {
  const library = await Library.findById(libraryId);
  if (!library) {
    throw new Error('Library not found');
  }

  const book = library.books.id(bookId);
  if (!book) {
    throw new Error('Book not found in library');
  }

  Object.assign(book, bookData);
  return await library.save();
}

async function deleteLibraryBook(libraryId, bookId) {
  const library = await Library.findById(libraryId);
  if (!library) {
    throw new Error('Library not found');
  }

  library.books.id(bookId).remove();
  return await library.save();
}

module.exports = {
  countBooksByAuthor,
  createLibrary,
  addBookToLibrary,
  getLibraryById,
  updateLibraryBook,
  deleteLibraryBook
};

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
  createLibrary,
  addBookToLibrary,
  getLibraryById,
  updateLibraryBook,
  deleteLibraryBook
};
