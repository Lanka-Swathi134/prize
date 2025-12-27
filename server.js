const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let participants = []; // Our temporary storage

// --- REGISTRATION ---
app.post('/api/register', (req, res) => {
    console.log("📥 Received Data:", req.body); // Check Render Logs for this!
    
    // Ensure we don't save empty data
    if (!req.body.name) {
        return res.status(400).json({ error: "Name is required" });
    }

    participants.push({
        id: participants.length + 1,
        ...req.body,
        date: new Date().toLocaleString()
    });
    
    res.json({ success: true });
});

// --- ADMIN DATA ---
app.get('/api/admin/data', (req, res) => {
    res.json(participants);
});

// --- LOGIN ---
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === 'pathology2025') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.listen(10000, () => console.log('🚀 Server active on port 10000'));
