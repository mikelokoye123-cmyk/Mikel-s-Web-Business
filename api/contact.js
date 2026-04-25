// Vercel Serverless Function (CommonJS)
module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Logs will appear in the Vercel Dashboard
        console.log('--- NEW MESSAGE RECEIVED ---');
        console.log(`From: ${name} (${email})`);
        console.log(`Message: ${message}`);
        console.log('---------------------------');

        return res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully! Mikel will get back to you soon.' 
        });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
