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
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.post('/send-inquiry', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Inquiry — Focus Health Club',
      text:
        'Name: ' + name +
        '\nPhone: ' + phone +
        '\nEmail: ' + email +
        '\nService: ' + service +
        '\nMessage: ' + message
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
