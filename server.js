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

// ─────────────────────────────────────────────────────
// EMAIL TRANSPORTER
// ─────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Focus Health Club backend is running ✅',
  });
});

// ─────────────────────────────────────────────────────
// SEND INQUIRY
// ─────────────────────────────────────────────────────

app.post('/send-inquiry', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    // Validation
    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, phone, and message are required.',
      });
    }

    // Email to gym owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Inquiry from ${name}`,
      html: `
        <h2>New Inquiry - Focus Health Club</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Service:</strong> ${service || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>

        <p>${message}</p>
      `,
    };

    // Auto reply to customer
    const autoReply = email
      ? {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Thank You For Contacting Focus Health Club',
          html: `
            <h2>Focus Health Club</h2>

            <p>Hi ${name},</p>

            <p>
              Thank you for contacting us.
              We have received your inquiry successfully.
            </p>

            <p>
              Our team will contact you shortly on:
              <strong>${phone}</strong>
            </p>

            <p>
              Stay Strong 💪
            </p>
          `,
        }
      : null;

    // Send emails
    await transporter.sendMail(mailOptions);

    if (autoReply) {
      await transporter.sendMail(autoReply);
    }

    // Success response
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

// ─────────────────────────────────────────────────────
// MEMBERSHIP BOOKING
// ─────────────────────────────────────────────────────

app.post('/book-membership', async (req, res) => {
  try {
    const { name, phone, email, plan, startDate, message } = req.body;

    // Validation
    if (!name || !phone || !plan) {
      return res.status(400).json({
        success: false,
        error: 'Name, phone, and plan are required.',
      });
    }

    // Email to gym owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Membership Booking - ${plan}`,
      html: `
        <h2>New Membership Booking</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Start Date:</strong> ${startDate || 'Not selected'}</p>
        <p><strong>Notes:</strong></p>

        <p>${message || 'No notes provided'}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
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

// ─────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
