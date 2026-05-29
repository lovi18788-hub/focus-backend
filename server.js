const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://health-zeta-ten.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.get('/test-email', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ success: true, message: 'Brevo connection working perfectly.' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/send-inquiry', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    await transporter.sendMail({
      from: process.env.BREVO_USER,
      to: 'lovi18788@gmail.com',
      subject: 'New Inquiry — Focus Health Club',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;padding:30px;background:#f9f9f9;border-radius:10px;">
          <h2 style="color:#111;border-bottom:3px solid #c8a96e;padding-bottom:10px;">
            New Inquiry — Focus Health Club
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-top:20px;">
            <tr>
              <td style="padding:10px;font-weight:bold;color:#555;width:120px;">Name</td>
              <td style="padding:10px;color:#111;">${name}</td>
            </tr>
            <tr style="background:#fff;">
              <td style="padding:10px;font-weight:bold;color:#555;">Phone</td>
              <td style="padding:10px;color:#111;">${phone}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:bold;color:#555;">Email</td>
              <td style="padding:10px;color:#111;">${email || 'Not provided'}</td>
            </tr>
            <tr style="background:#fff;">
              <td style="padding:10px;font-weight:bold;color:#555;">Service</td>
              <td style="padding:10px;color:#111;">${service || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:bold;color:#555;">Message</td>
              <td style="padding:10px;color:#111;">${message || 'No message'}</td>
            </tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#aaa;">
            Sent from Focus Health Club website inquiry form.
          </p>
        </div>
      `
    });

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
