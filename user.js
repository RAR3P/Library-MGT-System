const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get All Users
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM user');
        res.json(results);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [results] = await pool.execute('SELECT * FROM user WHERE id = ?', [userId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create User
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await pool.execute('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update User
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    try {
        await pool.execute('UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, userId]);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await pool.execute('DELETE FROM user WHERE id = ?', [userId]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
