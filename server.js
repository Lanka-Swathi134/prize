const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const db = new sqlite3.Database('./participants.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database Setup - Includes tokens column to store that data
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, year TEXT, section TEXT, email TEXT, phone TEXT, tokens INTEGER
)`);

// --- 1. ADMIN API (Used by your admin.html) ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'pathology2025') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get('/api/admin/data', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json([]);
        res.json(rows || []);
    });
});

// --- 2. REGISTRATION API (Fixed for JSON) ---
app.post('/api/register', (req, res) => {
    const { name, year, section, email, phone, tokens } = req.body;
    const query = `INSERT INTO users (name, year, section, email, phone, tokens) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [name, year, section, email, phone, tokens], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// --- 3. PAGE ROUTES ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
