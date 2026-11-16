
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: 'Rahul' },
        { id: 2, name: 'Amit' },
        { id: 3, name: 'Priya' }
    ]);
});

app.listen(3000, () => {
    console.log('Backend running on port 3000');
});
