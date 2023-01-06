
const express = require('express');
const app = express();
const path = require('path');
const port = process.argv;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(express.static('build/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017');

app.listen(port[2] || 8080, () => {

});

// Access to each page

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/register.html'));
});

// Create Schemas for database

const userSchema = {
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
};

const User = mongoose.model('User', userSchema);

// save data to database

app.post('/new-user', function (req, res) {
  User.findOne({ username: req.body.uname }, (error, user) => {
    if (error) {
      res.status(500).send(error);
    } else if (user) {
      res.send('Email already in use');
      res.redirect('/');
    } else {
      const newUser = new User({
        name: req.body.uname,
        password: req.body.psw
      });

      newUser.save((error) => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.redirect('/');
        }
      });
    }
  });
});
