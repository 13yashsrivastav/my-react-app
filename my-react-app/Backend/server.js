
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary data until MySQL is connected
let users = [];
let nextId = 1;

// Home route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to UserSpace API',
        status: 'Running'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is healthy'
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    res.status(200).json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
    const user = users.find(
        u => u.id === Number(req.params.id)
    );

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    res.json(user);
});

// Add new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
        return res.status(400).json({
            message: 'Name and email are required'
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = users.some(
        u => u.email === normalizedEmail
    );

    if (emailExists) {
        return res.status(409).json({
            message: 'Email already exists'
        });
    }

    const newUser = {
        id: nextId++,
        name: name.trim(),
        email: normalizedEmail
    };

    users.push(newUser);

    res.status(201).json({
        message: 'User created successfully',
        user: newUser
    });
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    if (!name?.trim() || !email?.trim()) {
        return res.status(400).json({
            message: 'Name and email are required'
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = users.some(
        u => u.email === normalizedEmail && u.id !== id
    );

    if (emailExists) {
        return res.status(409).json({
            message: 'Email already exists'
        });
    }

    user.name = name.trim();
    user.email = normalizedEmail;

    res.json({
        message: 'User updated successfully',
        user
    });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    users.splice(index, 1);

    res.json({
        message: 'User deleted successfully'
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('--------------------------------');
    console.log('       USERSPACE API');
    console.log('--------------------------------');
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/users`);
    console.log('Status: Running');
    console.log('--------------------------------');
});
