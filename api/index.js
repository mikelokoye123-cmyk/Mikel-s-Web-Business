const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); 

// Root route to serve index.html from root folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Simple in-memory storage for messages
const messages = [];

// POST /contact - Receive form data
app.post('/contact', (appData, res) => {
    const { name, email, message } = appData.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Save message
    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };
    messages.push(newMessage);

    // Also save to a simple JSON file for persistence
    const dbPath = path.join(__dirname, 'messages.json');
    fs.appendFileSync(dbPath, JSON.stringify(newMessage) + '\n');

    console.log('--- NEW MESSAGE RECEIVED ---');
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${message}`);
    console.log('---------------------------');

    res.status(200).json({ success: true, message: 'Message sent successfully! Mikel will get back to you soon.' });
});

// GET /messages - Just to check (optional)
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Only start listening if not running on Vercel (serverless)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;

