const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// This is where names are stored temporarily
let participants = []; 

// --- 1. ADMIN API ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'pathology2025') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get('/api/admin/data', (req, res) => {
    res.json(participants); // Sends the list to your admin page
});
app.post('/api/admin/clear', (req, res) => {
    participants = []; // Empties the memory array
    console.log("🧹 Registry cleared by Admin");
    res.json({ success: true });
});

// --- 2. REGISTRATION API ---
app.post('/api/register', (req, res) => {
    const newUser = req.body;
    // Add to our list
    participants.push({
        id: participants.length + 1,
        ...newUser
    });
    console.log("✅ New Registration:", newUser.name);
    res.json({ success: true });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
