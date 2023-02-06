const express = require('express');
const app = express();
const path = require('path');
const port = process.argv;
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');

const session = require('express-session');

app.use(express.static('build/public'));
app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost/occassionDB', { useNewUrlParser: true });

app.listen(port[2] || 8080, () => {

});

// create Session

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

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

// Create user Schema for database

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
      req.session.userId = user._id;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
});

// authenticate user to get to event

app.get('/event', (req, res) => {
  User.findById(req.session.userId, (error, user) => {
    if (error || !user) {
      return res.redirect('/');
    } else {
      res.sendFile(path.resolve(__dirname, 'build/event_app.html'));
    }
  });
});

// create Schema of tables for restaurant

const tableSchema = {
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

// Schema rooms where people can rent one or more for all sort of activities

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  capacity: {
    type: Number,
    required: true
  },
  isReserved: {
    type: Boolean,
    required: true,
    default: false
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tables: [tableSchema]
});

const Room = mongoose.model('Room', RoomSchema);

// create rooms with tables

const room1 = new Room({
  name: 'Room 1',
  number: 1,
  description: 'A spacious room with natural light.',
  capacity: 30,
  tables: [
    {
      number: 1,
      availability: true,
      seatNumber: 4
    },
    {
      number: 2,
      availability: true,
      seatNumber: 4
    },
    {
      number: 3,
      availability: true,
      seatNumber: 2
    },
    {
      number: 4,
      availability: true,
      seatNumber: 2
    }
  ]
});

const room2 = new Room({
  name: 'Room 2',
  number: 2,
  description: 'A spacious room with natural light.',
  capacity: 30,
  tables: [
    {
      number: 5,
      availability: true,
      seatNumber: 4
    },
    {
      number: 6,
      availability: true,
      seatNumber: 4
    },
    {
      number: 7,
      availability: true,
      seatNumber: 2
    },
    {
      number: 8,
      availability: true,
      seatNumber: 2
    }
  ]
});

const room3 = new Room({
  name: 'Room 3',
  number: 3,
  description: 'A spacious room with natural light.',
  capacity: 30,
  tables: [
    {
      number: 9,
      availability: true,
      seatNumber: 4
    },
    {
      number: 10,
      availability: true,
      seatNumber: 4
    },
    {
      number: 11,
      availability: true,
      seatNumber: 2
    },
    {
      number: 12,
      availability: true,
      seatNumber: 2
    }
  ]
});

const room4 = new Room({
  name: 'Room 4',
  number: 4,
  description: 'A spacious room with natural light.',
  capacity: 30,
  tables: [
    {
      number: 13,
      availability: true,
      seatNumber: 4
    },
    {
      number: 14,
      availability: true,
      seatNumber: 4
    },
    {
      number: 15,
      availability: true,
      seatNumber: 2
    },
    {
      number: 16,
      availability: true,
      seatNumber: 2
    }
  ]
});

// see if rooms are already on database

Room.findOne({ number: room1.number }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Room 1 already created');
  } else {
    room1.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Room 1 saved');
      }
    });
  }
});

Room.findOne({ number: room2.number }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Room 2 already created');
  } else {
    room2.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Room 2 saved');
      }
    });
  }
});

Room.findOne({ number: room3.number }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Room 3 already created');
  } else {
    room3.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Room 3 saved');
      }
    });
  }
});

Room.findOne({ number: room4.number }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Room 4 already created');
  } else {
    room4.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Room 4 saved');
      }
    });
  }
});

// create Schema guest

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Invited', 'Confirmed', 'Declined', 'Attended']
  },
  seatNumber: {
    table: Number,
    seat: Number
  }
});

// const Guest = mongoose.model('Guest', guestSchema);

// create Schema event

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    unique: true
  },
  roomNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  reserved: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guests: [guestSchema]
});

const Event = mongoose.model('Event', eventSchema);

const newEvent1 = new Event({
  name: 'Wedding Anniversary',
  date: new Date('2023-06-15'),
  roomNumber: ObjectId('63dd7ecc9812bd5a6cfe495e'),
  guests: [],
  seatingPlan: []
});

const newEvent2 = new Event({
  name: 'Wedding Anniversary for Joe',
  date: new Date('2023-06-16'),
  roomNumber: ObjectId('63dd7ecc9812bd5a6cfe4959'),
  guests: [],
  seatingPlan: []
});

Event.findOne({ date: newEvent1.date }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Event already created on that day');
  } else {
    newEvent1.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Event 1 saved');
      }
    });
  }
});

Event.findOne({ date: newEvent2.date }, (error, exists) => {
  if (error) {
    console.log(error);
  } else if (exists) {
    console.log('Event 2 already created on that day');
  } else {
    newEvent2.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Event 2 saved');
      }
    });
  }
});

// test ground for after

const objectId = new ObjectId('63dd81e8ee30441365a8a48c');
Event.findOne({ objectId }, (err, doc) => {
  if (err) {
    console.log(err);
  } else {
    console.log(doc);
  }
});
