const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend files from the root directory

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

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('Frontend is served from the root directory.');
});
