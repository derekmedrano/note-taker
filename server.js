// Required files
const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;

const app = express();

// Required middleware
app.use(express.static('public'));

app.use(express.json());

// GET route for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

  // GET route for reading and generating text
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'UTF-8', (err, data) => {
    res.send(data)
  })
  });

  // POST route for new notes
app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'UTF-8', (err, data) => {
    const notes = JSON.parse(data)
    const newNote = req.body
    newNote.id = uniqid()
    notes.push(newNote)
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
      res.json(newNote)
    })
  })
  });

// DELETE route for deleting notes, checks to see if any ID's match the desired input and deletes any data(or note) with that uniqid
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'UTF-8', (err, data) => {
    const notes = JSON.parse(data)
    const updatedNotes = notes.filter(note => note.id !== req.params.id)
    fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (err, data) => {
      res.send(200)
    })
  })
  });

  //WILDCARD route for any unknown/invalid queries
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });

// Allows app to deploy on local machine
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);