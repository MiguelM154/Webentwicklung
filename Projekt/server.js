
const express = require('express');
const app = express();
const path = require('path');
const port = process.argv;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(express.static('build/public'));
app.use(express.json());

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

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/login.html'));
});

app.get('/application', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/application.html'));
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

// save user to database after registeration

app.post('/new-user', function (req, res) {
  User.findOne({ username: req.body.username }, (error, user) => {
    if (error) {
      res.status(500).send(error);
    } else if (user) {
      res.send('Email already in use');
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
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

// login to app

app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username, password: req.body.password }, (error, user) => {
    if (error) {
      res.status(500).send(error);
    } else if (user) {
      res.send('Login successful');
    } else {
      res.send('Email or password is incorrect');
    }
  });
});

// create Schema of tables for restaurant

const tableSchema = {
  reserved: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  availability: {
    type: Boolean,
    required: true
  },
  seatNumber: {
    type: Number,
    required: true
  }
};

const Table = mongoose.model('Table', tableSchema);

const tableRest1 = new Table({
  number: 1,
  availability: true,
  seatNumber: 4
});

const tableRest2 = new Table({
  number: 2,
  availability: true,
  seatNumber: 4
});

const tableRest3 = new Table({
  number: 3,
  availability: true,
  seatNumber: 2
});

const tableRest4 = new Table({
  number: 4,
  availability: true,
  seatNumber: 2
});

Table.findOne({ number: tableRest1.number }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Table 1 already created');
  } else {
    tableRest1.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Table 1 saved');
      }
    });
  }
});

Table.findOne({ number: tableRest2.number }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Table 2 already created');
  } else {
    tableRest1.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Table 2 saved');
      }
    });
  }
});

Table.findOne({ number: tableRest3.number }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Table 3 already created');
  } else {
    tableRest1.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Table 3 saved');
      }
    });
  }
});

Table.findOne({ number: tableRest4.number }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Table 4 already created');
  } else {
    tableRest1.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Table 4 saved');
      }
    });
  }
});
