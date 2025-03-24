const express = require('express');
const pool = require('./config'); // Import the pool

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Route to fetch books
app.get('/books', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM books');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Login route example (for authentication)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Example query to check user credentials
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (rows.length > 0) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
