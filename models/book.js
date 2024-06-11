const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true, index: true },  // Indexed for faster search
  author: { type: String, required: true, index: true },  // Indexed for faster search
  quantity: { type: Number, default: 0 },
  publishedDate: { type: Date, required: true },
  isbn: { type: String, required: true, unique: true },  // Ensure ISBN is unique
  genre: { type: String, required: true },
  dateTaken: { type: Date },
  dateReturn: { type: Date },
  timeOfTaken: { type: String },
  timeOfReturn: { type: String },
  availability: { type: Boolean, default: true },
  category: { type: String, required: true, index: true },  // Indexed for faster search
  borrower: { type: Schema.Types.ObjectId, ref: 'Borrower', index: true },  // Indexed for faster lookups
  fine: { type: Number, default: 0 }
}, {
  timestamps: true,  // Automatically add createdAt and updatedAt fields
  toJSON: { virtuals: true },  // Ensure virtuals are included in toJSON output
  toObject: { virtuals: true }  // Ensure virtuals are included in toObject output
});

// Add a compound index to optimize queries filtering by author and category
bookSchema.index({ author: 1, category: 1 });

// Pre-save hook to update availability based on quantity
bookSchema.pre('save', function(next) {
  this.availability = this.quantity > 0;
  next();
});

// Virtual property for full title (title + author)
bookSchema.virtual('fullTitle').get(function() {
  return `${this.title} by ${this.author}`;
});

// Schema validation for dates
bookSchema.path('dateReturn').validate(function (value) {
  if (this.dateTaken && value) {
    return value >= this.dateTaken;
  }
  return true;
}, 'Return date must be greater than or equal to the taken date.');

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
