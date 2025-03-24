const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get All Borrowed Books
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM borrow');
        res.json(results);
    } catch (err) {
        console.error('Error fetching borrowed books:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Borrow Record by ID
router.get('/:id', async (req, res) => {
    const borrowId = req.params.id;
    try {
        const [results] = await pool.execute('SELECT * FROM borrow WHERE id = ?', [borrowId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching borrow record:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create Borrow Record
router.post('/', async (req, res) => {
    const { user_id, book_id, borrow_date, return_date } = req.body;
    try {
        await pool.execute('INSERT INTO borrow (user_id, book_id, borrow_date, return_date) VALUES (?, ?, ?, ?)', [user_id, book_id, borrow_date, return_date]);
        res.status(201).json({ message: 'Borrow record created successfully' });
    } catch (err) {
        console.error('Error creating borrow record:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Borrow Record
router.put('/:id', async (req, res) => {
    const borrowId = req.params.id;
    const { user_id, book_id, borrow_date, return_date } = req.body;
    try {
        await pool.execute('UPDATE borrow SET user_id = ?, book_id = ?, borrow_date = ?, return_date = ? WHERE id = ?', [user_id, book_id, borrow_date, return_date, borrowId]);
        res.json({ message: 'Borrow record updated successfully' });
    } catch (err) {
        console.error('Error updating borrow record:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete Borrow Record
router.delete('/:id', async (req, res) => {
    const borrowId = req.params.id;
    try {
        await pool.execute('DELETE FROM borrow WHERE id = ?', [borrowId]);
        res.json({ message: 'Borrow record deleted successfully' });
    } catch (err) {
        console.error('Error deleting borrow record:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
