const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRouter = require('./routes/books');
//require('dotenv').config(); // Ensure the path is correct

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json()); // Using body-parser to handle JSON payloads

// Connect to MongoDB
mongoose.connect('mongodb+srv://akshithsistla:ccipnWsoxp5NQ0nm@cluster0.iljkeyx.mongodb.net/librarymanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Use the book router
app.use('/books',bookRouter);

// Start the server  
const PORT = 3009;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
