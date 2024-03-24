require('dotenv').config();

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS); // Be cautious with logging passwords
console.log(process.env.DB_NAME);
console.log(process.env.DB_PORT);

const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3003;

// Initialize connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API route for fetching items and a random item
app.get('/api/items', async (req, res) => {
    const randomItemResult = await pool.query('SELECT * FROM items ORDER BY RANDOM() LIMIT 1');
    const randomItem = randomItemResult.rows[0];
    
    const allItemsResult = await pool.query('SELECT * FROM items ORDER BY id');
    const items = allItemsResult.rows;

    res.json({ randomItem, items });
});

// API route for adding an item
app.post('/api/add', async (req, res) => {
    const { content } = req.body;
    try {
        await pool.query('INSERT INTO items(content) VALUES ($1)', [content]);
        res.sendStatus(200); // Successfully added item
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('Error adding item');
    }
});

// API route for deleting an item
app.post('/api/delete', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM items WHERE id = $1', [id]);
        res.sendStatus(200); // Successfully deleted item
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).send('Error deleting item');
    }
});

// Handle React routing, return all requests to React app, must be placed last
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
