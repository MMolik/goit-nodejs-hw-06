const formData = require('form-data');
const Mailgun = require('mailgun.js');
const dotenv = require('dotenv');

// Wczytaj zmienne środowiskowe z .env
dotenv.config();

// Sprawdź, czy wszystkie zmienne środowiskowe są dostępne
if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.SENDER_EMAIL || !process.env.BASE_URL) {
  throw new Error('Missing environment variables for Mailgun or email service');
}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

const sendVerificationEmail = (email, token) => {
  // Logujemy adres e-mail, nadawcę oraz inne istotne dane
  console.log('Email to be sent to:', email);
  console.log('Sender email:', process.env.SENDER_EMAIL);
  console.log('Mailgun domain:', process.env.MAILGUN_DOMAIN);
  
  const verificationUrl = `${process.env.BASE_URL}/api/users/verify/${token}`;
  console.log('Verification URL:', verificationUrl);

  const data = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`
  };

  return mg.messages.create(process.env.MAILGUN_DOMAIN, data)
    .then(response => {
      console.log('Mailgun response:', response);
      return response;
    })
    .catch(error => {
      console.error('Mailgun error:', error);
      throw error;
    });
};

module.exports = { sendVerificationEmail };
