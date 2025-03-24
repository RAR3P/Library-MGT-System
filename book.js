const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get All Books
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.execute('SELECT * FROM book');
        res.json(results);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Book by ID
router.get('/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        const [results] = await pool.execute('SELECT * FROM book WHERE id = ?', [bookId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create Book
router.post('/', async (req, res) => {
    const { title, author, publish_year } = req.body;
    try {
        await pool.execute('INSERT INTO book (title, author, publish_year) VALUES (?, ?, ?)', [title, author, publish_year]);
        res.status(201).json({ message: 'Book created successfully' });
    } catch (err) {
        console.error('Error creating book:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Book
router.put('/:id', async (req, res) => {
    const bookId = req.params.id;
    const { title, author, publish_year } = req.body;
    try {
        await pool.execute('UPDATE book SET title = ?, author = ?, publish_year = ? WHERE id = ?', [title, author, publish_year, bookId]);
        res.json({ message: 'Book updated successfully' });
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete Book
router.delete('/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        await pool.execute('DELETE FROM book WHERE id = ?', [bookId]);
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
