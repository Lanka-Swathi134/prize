const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const db = new sqlite3.Database('./participants.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- DATABASE SETUP (Updated to include tokens) ---
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, 
    year TEXT, 
    section TEXT, 
    email TEXT, 
    phone TEXT,
    tokens INTEGER
)`);

// --- 1. ADMIN LOGIN & DATA API ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'pathology2025') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// Fetch all registered students for the admin panel
app.get('/api/admin/data', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// --- 2. HANDLE REGISTRATION (Updated) ---
// This route now handles the JSON data sent by the "Success Message" script
app.post('/api/register', (req, res) => {
    const { name, year, section, email, phone, tokens } = req.body;
    
    const query = `INSERT INTO users (name, year, section, email, phone, tokens) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [name, year, section, email, phone, tokens], function(err) {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        console.log(`New Registration: ${name} with ${tokens} tokens`);
        res.json({ success: true, id: this.lastID });
    });
});

// --- 3. SERVE PAGES ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Use Render's dynamic port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('------------------------------------------');
    console.log(`✅ SERVER IS LIVE ON PORT ${PORT}`);
    console.log(`📝 Registration: http://localhost:${PORT}`);
    console.log(`🔑 Admin Panel:  http://localhost:${PORT}/admin`);
    console.log('------------------------------------------');
});
