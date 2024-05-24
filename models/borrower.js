const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowerSchema = new Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('borrower', borrowerSchema);
