```js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Focus Health Club Backend Running Successfully ✅',
  });
});

// Send Inquiry Route
app.post('/send-inquiry', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill all required fields.',
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Inquiry From ${name}`,
      html: `
        <h2>New Inquiry - Focus Health Club</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Not Provided'}</p>
        <p><strong>Service:</strong> ${service || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>

        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Inquiry sent successfully!',
    });

  } catch (error) {
    console.error('SEND INQUIRY ERROR:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to send inquiry.',
    });
  }
});

// Membership Booking Route
app.post('/book-membership', async (req, res) => {
  try {
    const { name, phone, email, plan, startDate, message } = req.body;

    if (!name || !phone || !plan) {
      return res.status(400).json({
        success: false,
        error: 'Please fill all required fields.',
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Membership Booking - ${plan}`,
      html: `
        <h2>New Membership Booking</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Not Provided'}</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Start Date:</strong> ${startDate || 'Not Selected'}</p>
        <p><strong>Message:</strong></p>

        <p>${message || 'No Message'}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Membership booking received!',
    });

  } catch (error) {
    console.error('BOOKING ERROR:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to process booking.',
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
