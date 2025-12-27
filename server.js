const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
// This line connects your CSS/Images in the 'public' folder
app.use(express.static('public')); 

let participants = []; // Memory storage for the 5-day event

// --- 1. ROUTE TO SHOW ADMIN PAGE ---
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// --- 2. REGISTRATION API ---
app.post('/api/register', (req, res) => {
    const newUser = req.body;
    participants.push({
        id: participants.length + 1,
        ...newUser,
        time: new Date().toLocaleString()
    });
    console.log("✅ New Registration saved in memory");
    res.json({ success: true });
});

// --- 3. ADMIN DATA API ---
app.get('/api/admin/data', (req, res) => {
    res.json(participants);
});

// --- 4. LOGIN API ---
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === 'pathology2025') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// --- 5. CLEAR DATA API ---
app.post('/api/admin/clear', (req, res) => {
    participants = [];
    res.json({ success: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
