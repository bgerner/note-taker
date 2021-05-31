const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

// use with express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.json(db)
});

app.post('/api/notes', (req, res) => {
    // let newNote = req.body;
    // newNote.id = uuidv4()
    let newNote = {
        ...req.body,
        id: uuidv4()
    }
    db.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, 'db', 'db.json'),
        JSON.stringify(db, null, 2)
    );
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    for (let i = 0; i < db.length; i++) {
        if (id === db[i].id) {
            db.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, 'db', 'db.json'),
                JSON.stringify(db, null, 2)
            );
        }
    }
    res.json(db);
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});