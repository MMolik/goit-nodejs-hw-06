require('dotenv').config();
const { sendVerificationEmail } = require('./services/emailService');

sendVerificationEmail('marcinmolik.lodz@gmail.com', 'test-token')
  .then(response => {
    console.log('Test email sent successfully:', response);
  })
  .catch(error => {
    console.error('Error sending test email:', error);
  });

  