const Borrower = require('../models/borrower');

async function createBorrower(borrowerData) {
  try {
    const borrower = new Borrower(borrowerData);
    return await borrower.save();
  } catch (error) {
    throw new Error('Could not create borrower: ' + error.message);
  }
}

async function getBorrowerById(id) {
  try {
    return await Borrower.findById(id);
  } catch (error) {
    throw new Error('Could not find borrower: ' + error.message);
  }
}

module.exports = {
  createBorrower,
  getBorrowerById
};
