/* const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// 1. Database Connection Configuration
const pool = new Pool({
    user: 'postgres',
    host:'localhost',
    database: 'autodiag',
    password: 'Bescious_98',
    port:5432,
})

// 2. Middleware to parse incoming HTML form data (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Serve the static HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. POST endpoint to handle form submission
app.post('/add-user', async (req, res) => {
    // Extract data from the form (matches the 'name' attributes in the HTML)
    const { username, email } = req.body;

    // Parameterized query ($1, $2) prevents SQL Injection
    const insertQuery = `
        INSERT INTO users (username, email) 
        VALUES ($1, $2) 
        RETURNING *;
    `;

    try {
        const result = await pool.query(insertQuery, [username, email]);
        console.log('Inserted row:', result.rows[0]);
        res.status(200).send('User registered successfully!');
    } catch (err) {
        console.error('Database insertion error:', err.stack);
        res.status(500).send('Error inserting data into database.');
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});