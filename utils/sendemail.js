require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address from environment variables
    pass: process.env.EMAIL_PASS, // Your email password from environment variables
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Function to send an email
const sendBorrowerEmail = (recipientEmail, bookTitle, dateTaken, timeTaken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: recipientEmail, // List of recipients
    subject: 'Book Borrowed Notification', // Subject line
    text: `You have borrowed the book titled "${bookTitle}".\n\nDate Taken: ${dateTaken}\nTime Taken: ${timeTaken}\n\nPlease remember to return it on time.`, // Plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};

module.exports = sendBorrowerEmail;
