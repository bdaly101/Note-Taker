const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('../helpers/fsUtils');
  
  // GET Route for retrieving all the notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


notes.post('/', (req, res) => {
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully`);
    } else {
      res.error('Error in adding note');
    }
  });

  // DELETE Route for a note by id
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
          // Filter out the note with the id to delete
          const result = json.filter((note) => note.id !== noteId);

          // Write back the remaining notes
          writeToFile('./db/db.json', result);

          res.json(`Note with id ${noteId} has been deleted`);
      })
      .catch((err) => {
          res.error('Error in deleting note');
      });
});
  
  module.exports = notes;