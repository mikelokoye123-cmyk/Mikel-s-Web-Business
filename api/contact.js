const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// POST /api/contact - Receive form data
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    console.log('--- NEW MESSAGE RECEIVED ---');
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${message}`);
    console.log('---------------------------');

    res.status(200).json({ success: true, message: 'Message sent successfully! Mikel will get back to you soon.' });
});

module.exports = app;
