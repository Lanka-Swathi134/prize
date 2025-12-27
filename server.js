const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const db = new sqlite3.Database('./participants.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database Setup
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, year TEXT, section TEXT, email TEXT, phone TEXT
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

app.get('/api/admin/data', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        res.json(rows || []);
    });
});

// --- 2. HANDLE REGISTRATION ---
app.post('/register', (req, res) => {
    const { name, year, section, email, phone } = req.body;
    const stmt = db.prepare("INSERT INTO users (name, year, section, email, phone) VALUES (?, ?, ?, ?, ?)");
    stmt.run(name, year, section, email, phone);
    stmt.finalize();
    res.send(`
        <body style="background:#5a0001; color:white; font-family:sans-serif; text-align:center; padding-top:100px;">
            <h1>Successfully Registered!</h1>
            <p>Participate. Explore. Prosper.</p>
            <a href="/" style="color:#d4af37;">Go Back</a>
        </body>
    `);
});
app.post('/register-json', (req, res) => {
    const { name, year, section, email, phone } = req.body;
    // Note: Added 'email' to both columns and values
    const stmt = db.prepare("INSERT INTO users (name, year, section, email, phone) VALUES (?, ?, ?, ?, ?)");
    stmt.run(name, year, section, email, phone, (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
    stmt.finalize();
});

// --- 3. SERVE PAGES ---

// Registration Page (Home)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin Page (The fix)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
// Use path.join to ensure the server finds the right directory on Render


app.listen(3000, () => {
    console.log('------------------------------------------');
    console.log('✅ SERVER IS LIVE');
    console.log('📝 Registration: http://localhost:3000');
    console.log('🔑 Admin Panel:  http://localhost:3000/admin');
    console.log('------------------------------------------');
});
