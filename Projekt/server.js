
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
  username: String,
  password: String
};

const User = mongoose.model('User', userSchema);

// save data to database

app.post('/register', function (req, res) {
  const newUser = new User({
    username: req.body.uname,
    password: req.body.psw
  });
  newUser.save();
});
