const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
port: 465,
secure: true,
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

app.get('/', (req, res) => {
res.json({
success: true,
message: 'Backend running',
});
});

app.post('/send-inquiry', async (req, res) => {
try {
const { name, phone, email, service, message } = req.body;

```
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: `New Inquiry From ${name}`,
  html: `
    <h2>New Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Service:</strong> ${service}</p>
    <p><strong>Message:</strong> ${message}</p>
  `,
};

await transporter.sendMail(mailOptions);

res.json({
  success: true,
  message: 'Inquiry sent successfully',
});
```

} catch (error) {
console.error(error);

```
res.status(500).json({
  success: false,
  error: 'Failed to send inquiry',
});
```

}
});

app.post('/book-membership', async (req, res) => {
try {
const { name, phone, email, plan } = req.body;

```
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: `New Membership Booking`,
  html: `
    <h2>Membership Booking</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Plan:</strong> ${plan}</p>
  `,
};

await transporter.sendMail(mailOptions);

res.json({
  success: true,
  message: 'Membership booked successfully',
});
```

} catch (error) {
console.error(error);

```
res.status(500).json({
  success: false,
  error: 'Failed to book membership',
});
```

}
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
