// services/borrowerservice.js

const Borrower = require('../models/borrower');

async function createBorrower(borrowerData) {
  const borrower = new Borrower(borrowerData);
  return await borrower.save();
}

async function getBorrowerById(id) {
  return await Borrower.findById(id);
}

async function getAllBorrowers() {
  return await Borrower.find();
}

module.exports = {
  createBorrower,
  getBorrowerById,
  getAllBorrowers
};
