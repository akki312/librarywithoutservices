const Borrower = require('../models/borrower');

async function createBorrower(borrowerData) {
  const borrower = new Borrower(borrowerData);
  return await borrower.save();
}

async function getBorrowerById(id) {
  return await Borrower.findById(id);
}

module.exports = {
  createBorrower,
  getBorrowerById
};
