const express = require("express");
const db = require('db.js');
const shortid = require("shortid");
const server = express();

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});

server.use(express.json());


// CREATE
server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  }
  db.insert(req.body)
  .then(user => res.status(201).json(user))
  .catch(err => res.status(500).json({ errorMessage: "There was an error while saving the user to the database", success: false, err }))
});


// READ all users
server.get('/api/users', (req, res) => {
  db.find()
  .then(user => res.status(200).json(user))
  .catch(err => res.status(500).json({ errorMessage: "The users information could not be retrieved", success: false, err }))
});

// READ by id
server.get('/api/users/:id', (req, res) => {
  const { id } = req.params.id;

  db.findById(id)
  .then(user => {
    if(!user){
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
      res.status(200).json(user)
    }
  })
  .catch(err => res.status(500).json({ errorMessage: "The user information could not be retrieved.", success: false, err }))
});

// UPDATE
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params.id;
  const { name, bio } = req.body;

  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  }
  db.update(id, req.body)
  .then(user => {
    if(!user){
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
      res.status(200).json(user)
    }
  })
  .catch(err => res.status(500).json({ errorMessage: "The user information could not be modified.", success: false, err }))
});


// DELETE
server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params.id;
  
  db.findById(id)
  .then(user => {
    if(!user){
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
      db.remove(id)
      .then(res.status(200).json({ message: "User Deleted" }))
      .catch(err => res.status(500).json({ errorMessage: "The user could not be removed", err }))
    }
  })
  .catch(err => res.status(500).json({ errorMessage: "The user could not be removed", err }))
});