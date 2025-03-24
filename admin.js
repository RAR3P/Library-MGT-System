const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get All Admins
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM admin');
        res.json(results);
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Admin by ID
router.get('/:id', async (req, res) => {
    const adminId = req.params.id;
    try {
        const [results] = await pool.execute('SELECT * FROM admin WHERE id = ?', [adminId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching admin:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create Admin
router.post('/', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        await pool.execute('INSERT INTO admin (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Admin
router.put('/:id', async (req, res) => {
    const adminId = req.params.id;
    const { username, password, role } = req.body;
    try {
        await pool.execute('UPDATE admin SET username = ?, password = ?, role = ? WHERE id = ?', [username, password, role, adminId]);
        res.json({ message: 'Admin updated successfully' });
    } catch (err) {
        console.error('Error updating admin:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete Admin
router.delete('/:id', async (req, res) => {
    const adminId = req.params.id;
    try {
        await pool.execute('DELETE FROM admin WHERE id = ?', [adminId]);
        res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        console.error('Error deleting admin:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
