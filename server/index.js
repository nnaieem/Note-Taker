const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs').promises;

const app = express();
const port = 3000;

const dbFilePath = path.resolve(__dirname, '..', 'db', 'db.json');

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// PATH TO MAIN HTML PAGE
app.get('/', (_, res) => {
    const filePath = path.resolve(__dirname, '..', 'public', 'index.html');

    res.sendFile(filePath);
});

// PATH TO NOTES HTML PAGE
app.get('/notes', (_, res) => {
    const filePath = path.resolve(__dirname, '..', 'public', 'notes.html');

    res.sendFile(filePath);
});

// 
app.get('/api/notes', async (_, res) => {
    const fileData = await fs.readFile(dbFilePath, 'utf-8');
    const data = JSON.parse(fileData);

    res.json(data);
});

app.post('/api/notes', async (req, res) => {
    const { title, text } = req.body;

    const fileData = await fs.readFile(dbFilePath, 'utf-8');
    const data = JSON.parse(fileData);

    data.push({
        id: shortid.generate(),
        title,
        text
    });

    await fs.writeFile(dbFilePath, JSON.stringify(data));

    res.json({
        success: true
    });
});

app.delete('/api/notes/:id', async (req, res) => {
    const noteId = req.params.id;
    console.log(noteId);

    const fileData = await fs.readFile(dbFilePath, 'utf-8');
    const data = JSON.parse(fileData);

    const newData = data.filter(note => note.id == noteId);
    await fs.writeFile(dbFilePath, JSON.stringify(newData));

    res.json({
        success: true
    });
});

// PATH TO REDIRECT TO MAIN PAGE IF PAGE DOES NOT EXIST
app.use('*', (_, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
    
});