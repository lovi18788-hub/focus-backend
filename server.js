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
subject: 'New Inquiry From ' + name,
text:
'Name: ' + name +
'\nPhone: ' + phone +
'\nEmail: ' + email +
'\nService: ' + service +
'\nMessage: ' + message
};
