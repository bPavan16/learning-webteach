const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db/connection');

const app = express();

app.use(bodyParser.json());
app.use(express.static('pages'));
app.use(express.static('public'));

app.get('/books', (req, res) => {
    const query = `
        SELECT books.id, books.title, books.published_date, books.quantity, authors.name AS author
        FROM books
        INNER JOIN authors ON books.author_id = authors.id;
    `;
    pool.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new book with author validation
app.post('/books', (req, res) => {
    const { title, authorName, publishedDate, quantity } = req.body;

    if (!title || !authorName || !publishedDate || quantity == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if author exists
    const authorQuery = 'SELECT id FROM authors WHERE name = ?';
    pool.query(authorQuery, [authorName], (err, authorResults) => {
        if (err) return res.status(500).json({ error: err.message });

        let authorId = null;
        if (authorResults.length > 0) {
            authorId = authorResults[0].id;
            insertBook();
        } else {
            // Add new author if not found
            const insertAuthor = 'INSERT INTO authors (name, bio) VALUES (?, ?)';
            pool.query(insertAuthor, [authorName, ''], (err, authorInsertResult) => {
                if (err) return res.status(500).json({ error: err.message });
                authorId = authorInsertResult.insertId;
                insertBook();
            });
        }

        function insertBook() {
            const bookQuery = 'INSERT INTO books (title, author_id, published_date, quantity) VALUES (?, ?, ?, ?)';
            pool.query(bookQuery, [title, authorId, publishedDate, quantity], (err, bookInsertResult) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Book added successfully', bookId: bookInsertResult.insertId });
            });
        }
    });
});

app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity == null) {
        return res.status(400).json({ error: 'Quantity is required' });
    }

    const query = 'UPDATE books SET quantity = ? WHERE id = ?';
    pool.query(query, [quantity, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Quantity updated successfully' });
    });
});

app.delete('/books/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM books WHERE id = ?';
    pool.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
