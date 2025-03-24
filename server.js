require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise'); // Use mysql2 promise version
const jwt = require('jsonwebtoken'); // For JWT token generation
const rateLimit = require('express-rate-limit'); // For rate limiting
const app = express();

// Ensure environment variables are loaded correctly
if (!process.env.DB_PASSWORD || !process.env.PORT || !process.env.JWT_SECRET) {
    console.error('❌ Missing required environment variables. Please check your .env file.');
    process.exit(1); // Exit if essential variables are missing
}

// MySQL connection pool configuration (with async/await support)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,  // Ensure password is set in .env
    database: process.env.DB_NAME || 'libraryldb',
    port: process.env.DB_PORT || 3306,  // Default MySQL port
});

// Rate limiting for login route to prevent brute-force attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts, please try again later.',
});

// Middleware
app.use(cors());                         // Enable CORS for FrontEnd requests
app.use(bodyParser.json());              // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static FrontEnd files
app.use(express.static(path.join(__dirname, 'FrontEnd')));

// ✅ Test API Route - Serve homepage
app.get('/', (req, res) => {
    console.log('✅ Request received at /');
    res.sendFile(path.resolve(__dirname, 'FrontEnd', 'index.html'));
});

// ✅ Fetch all books or search for books
app.get('/books', async (req, res) => {
    console.log('✅ Request received at /books');
    const searchQuery = req.query.search || '';
    try {
        let query = 'SELECT * FROM book';
        let params = [];
        
        if (searchQuery) {
            // Updated search query to match book titles or authors
            query += ' WHERE Title LIKE ? OR Author LIKE ?';
            params = [`%${searchQuery}%`, `%${searchQuery}%`];
        }

        const [results] = await pool.execute(query, params); 
        res.json(results);
    } catch (err) {
        console.error('❌ Error fetching books:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Fetch borrowed books by user ID
app.get('/user/:id/borrowed', async (req, res) => {
    console.log(`✅ Request received at /user/${req.params.id}/borrowed`);
    const userId = req.params.id;
    try {
        const [results] = await pool.execute('SELECT * FROM Borrow WHERE User_ID = ?', [userId]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'No borrowed books found for this user' });
        }
        res.json(results);
    } catch (err) {
        console.error('❌ Error fetching borrowed books:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Serve Login Page
app.get('/login', (req, res) => {
    console.log('✅ Request received at /login');
    res.sendFile(path.resolve(__dirname, 'FrontEnd', 'login.html'));
});

// ✅ Login POST Route - Handle user authentication with hashed password
app.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    console.log(`✅ Login attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
        console.log('❌ Email and password are required');
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Query the database to find the user by email
        const [results] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);

        // Check if user exists
        if (results.length === 0) {
            console.log('❌ No user found with this email');
            return res.status(400).json({ error: 'Invalid email or password' }); // Generic error for security
        }

        const user = results[0];

        // Debug: Log the user object (excluding sensitive data)
        console.log('User found:', { id: user.id, email: user.email });

        // Check if the password field exists in the database for the user
        if (!user.password) {
            console.log('❌ Password not set for this user');
            return res.status(400).json({ error: 'Password not set for this user' });
        }

        // Debug: Log the hashed password from the database
        console.log('Hashed password from DB:', user.password);

        // Compare the provided password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        // Debug: Log the password comparison result
        console.log('Password match:', isPasswordMatch);

        if (isPasswordMatch) {
            console.log('✅ Login successful');

            // Generate a JWT token for session management
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET, // Ensure JWT_SECRET is set in .env
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            // Send a response with the token and user details (excluding sensitive data)
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    // Add other non-sensitive user details here
                },
            });
        } else {
            console.log('❌ Incorrect password');
            return res.status(400).json({ error: 'Invalid email or password' }); // Generic error for security
        }
    } catch (err) {
        console.error('❌ Error during login:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Fetch all admins
app.get('/admins', async (req, res) => {
    console.log('✅ Request received at /admins');
    try {
        const [results] = await pool.execute('SELECT * FROM admin');
        if (results.length === 0) {
            console.log('❌ No admins found');
            return res.status(404).json({ error: 'No admins found' });
        }
        res.json(results);
    } catch (err) {
        console.error('❌ Error fetching admins:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Fetch individual admin by ID
app.get('/admin/:id', async (req, res) => {
    const adminId = req.params.id;
    console.log(`✅ Request received at /admin/${adminId}`);

    try {
        const [results] = await pool.execute('SELECT * FROM admin WHERE Admin_ID = ?', [adminId]);

        if (results.length === 0) {
            console.log(`❌ No admin found with ID ${adminId}`);
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('❌ Error fetching admin:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Admin Route - Fetch all users
app.get('/admin/users', async (req, res) => {
    console.log('✅ Request received at /admin/users');
    try {
        const [results] = await pool.execute('SELECT * FROM Users');
        res.json(results);
    } catch (err) {
        console.error('❌ Error fetching users:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Test Database Connection - Add this route
app.get('/test-db', async (req, res) => {
    console.log('✅ Request received at /test-db');
    try {
        const [rows] = await pool.execute('SELECT 1');
        res.send('Database connection is successful!');
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        res.status(500).json({ error: 'Failed to connect to the database' });
    }
});

// ✅ Temporary Route Debugger
app._router.stack.forEach(function(r) {
    if (r.route && r.route.path) {
        console.log(`Route: ${r.route.path}`);
    }
});

// ✅ Start the server on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// Gracefully close the MySQL connection when the server shuts down
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('✅ MySQL connection pool closed.');
        process.exit(0);
    });
});