
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to UserSpace API',
        status: 'Running'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Backend is healthy' });
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email FROM users ORDER BY id DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});

// Get one user
app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email FROM users WHERE id = ?',
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});

// Add user
app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
        return res.status(400).json({
            message: 'Name and email are required'
        });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name.trim(), email.trim().toLowerCase()]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: result.insertId,
                name: name.trim(),
                email: email.trim().toLowerCase()
            }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
        return res.status(400).json({
            message: 'Name and email are required'
        });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name.trim(), email.trim().toLowerCase(), req.params.id]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            user: {
                id: Number(req.params.id),
                name: name.trim(),
                email: email.trim().toLowerCase()
            }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [req.params.id]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`UserSpace API running on port ${PORT}`);
});
