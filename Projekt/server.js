const express = require('express');
const app = express();
const path = require('path');
const port = process.argv;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const session = require('express-session');

app.use(express.static('build/public'));
app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/occassionDB', { useNewUrlParser: true });

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

app.get('/block', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/loginblock.html'));
});

app.get('/application', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/application.html'));
});

// create Schema guest

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  child: {
    type: String,
    enum: ['Ja', 'Nein'],
    required: true
  },
  status: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Guest = mongoose.model('Guest', guestSchema);

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

// create Schema of tables for restaurant

const tableSchema = {
  number: {
    type: Number,
    required: true,
    unique: true
  },
  seatsAvailable: {
    type: Number,
    required: true
  },
  typeoftableseat: {
    type: String,
    enum: ['einseitig', 'zweiseitig', 'undefined'],
    required: true
  },
  tableform: {
    type: String,
    enum: ['rechteckiger Tisch', 'kreis Tisch', 'quadratischer Tisch', 'undefined'],
    required: true
  }
};

const Table = mongoose.model('Table', tableSchema);

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
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  numberOfTables: {
    type: Number,
    required: true
  },
  tables: [tableSchema]
});

const Room = mongoose.model('Room', RoomSchema);

// create Schema for seats in event

const SeatSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true
  },
  tableNumber: {
    type: Number,
    required: true
  },
  seatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  },
  seatNumber: {
    type: Number,
    required: true
  },
  typeoftableseat: {
    type: String,
    enum: ['einseitig', 'zweiseitig', 'undefined'],
    required: true
  },
  tableform: {
    type: String,
    enum: ['rechteckiger Tisch', 'kreis Tisch', 'quadratischer Tisch', 'undefined'],
    required: true
  }
});

// create Schema event

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  roomNumber: [Number],
  reserved: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seatingPlan: [SeatSchema]
});

const Event = mongoose.model('Event', eventSchema);

// save user to database after registration

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
      return res.redirect('/block');
    } else {
      res.sendFile(path.resolve(__dirname, 'build/event_app.html'));
    }
  });
});

// authenticate user to get to event

app.get('/delevent', (req, res) => {
  User.findById(req.session.userId, (error, user) => {
    if (error || !user) {
      return res.redirect('/block');
    } else {
      res.sendFile(path.resolve(__dirname, 'build/delevent.html'));
    }
  });
});

// get data for tables and forms  5587948

app.get('/api/dataEvent', (req, res) => {
  Event.find({}, function (err, events) {
    if (err) {
      return console.error(err);
    } else {
      const filteredEvents = events.filter(function (obj) {
        return (String(obj.reserved) === String(req.session.userId));
      });
      Room.find({}, (error, rooms) => {
        if (error) {
          console.log(error);
        } else {
          Table.find({}, (error, tables) => {
            if (error) {
              console.log(error);
            } else {
              Guest.find({}, (error, guests) => {
                if (error) {
                  console.log(error);
                } else {
                  const filteredGuests = guests.filter(function (obj) {
                    return (String(obj.user) === String(req.session.userId));
                  });
                  res.json({ filteredEvents, rooms, tables, filteredGuests });
                }
              });
            }
          });
        }
      });
    }
  });
});

// get Guestform data

app.post('/new-guest', (req, res) => {
  const newGuest = new Guest({
    name: req.body.name,
    child: req.body.isChild,
    status: req.body.gstatus,
    user: req.session.userId
  });

  newGuest.save((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.redirect('/event');
    }
  });
});

// get Eventform data

app.post('/new-event', (req, res) => {
  const newEvent = new Event({
    name: req.body.ename,
    date: req.body.edate,
    roomNumber: req.body.roomforevent,
    reserved: req.session.userId,
    seatingPlan: []
  });

  newEvent.save((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.redirect('/event');
    }
  });
});

// get list of rooms available in that day

app.post('/data', function (req, res) {
  const data = req.body;
  const roomList = [];
  Event.find({}, function (err, events) {
    if (err) {
      return console.error(err);
    } else {
      const dateD = new Date(data.da);
      const yearD = dateD.getFullYear();
      const monthD = dateD.getMonth();
      const dayD = dateD.getDate();
      const filteredEvents = events.filter(function (obj) {
        const date = new Date(obj.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return ((dayD === day) && (yearD === year) && (monthD === month));
      });
      let isTrue = false;
      for (let j = 0; j < filteredEvents.length; j++) {
        for (let i = 0; i < filteredEvents[j].roomNumber.length; i++) {
          for (let g = 0; g < roomList.length; g++) {
            if (roomList[g] === filteredEvents[j].roomNumber[i]) {
              isTrue = true;
              break;
            }
          }
          if (isTrue === false) {
            roomList.push(filteredEvents[j].roomNumber[i]);
          }
          isTrue = false;
        }
      }
      res.json({ rooms: roomList });
    }
  });
});

// see if guest is already in event

app.post('/data-guest-event', function (req, res) {
  Event.find({}, function (err, events) {
    if (err) {
      return console.error(err);
    } else {
      const filteredEvents = events.filter(function (obj) {
        let ob;
        if (String(obj._id) === String(req.body.dt)) {
          let isTrue = false;
          for (let i = 0; i < obj.seatingPlan.length; i++) {
            if (String(obj.seatingPlan[i].seatedBy) === String(req.body.da)) {
              isTrue = true;
            }
          }
          if (isTrue === false) {
            ob = obj;
          }
        }
        return ob;
      });
      res.json({ filtered: filteredEvents });
    }
  });
});

// get Seat placement data

app.post('/new-placement', (req, res) => {
  const ObjectId = require('mongodb').ObjectId;
  const MongoClient = require('mongodb').MongoClient;
  const uri = 'mongodb://127.0.0.1:27017/';

  MongoClient.connect(uri, function (err, client) {
    if (err) {
      return console.log('Error connecting to the database: ' + err);
    }
    const db = client.db('occassionDB');
    const collection = db.collection('events');
    collection.updateOne({ _id: ObjectId(req.body.guestevent) },
      {
        $push: {
          seatingPlan: {
            roomNumber: req.body.rooms,
            tableNumber: req.body.seatTable,
            seatedBy: ObjectId(req.body.gie),
            seatNumber: req.body.seatSeat,
            typeoftableseat: 'undefined',
            tableform: 'undefined'
          }
        }
      }
    );
  });
  res.redirect('/event');
});

// delete event from collection "events"

app.post('/delete-event', function (req, res) {
  Event.findOne({ _id: req.body.eventId }, (error, exists) => {
    if (error) {
      console.log(error);
    } else if (exists) {
      const idofEventToDelete = { _id: req.body.eventId };
      Event.deleteOne(idofEventToDelete, (error) => {
        if (error) {
          console.log(error);
        } else {
          res.redirect('/delevent');
        }
      });
    }
  });
});

// remove Gast from collection "guests"

app.post('/delete-gast', function (req, res) {
  Guest.findOne({ _id: req.body.gastid }, (error, exists) => {
    if (error) {
      console.log(error);
    } else if (exists) {
      const idofGuestToDelete = { _id: req.body.gastid };
      Guest.deleteOne(idofGuestToDelete, (error) => {
        if (error) {
          console.log(error);
        } else {
          res.redirect('/delevent');
        }
      });
    } else {
      console.log('Gast existiert nicht');
    }
  });
});

// Reservierung L??schen
app.post('/delete-reserv', function (req, res) {
  const ObjectId = require('mongodb').ObjectId;
  const MongoClient = require('mongodb').MongoClient;
  const uri = 'mongodb://127.0.0.1:27017/';

  MongoClient.connect(uri, function (err, client) {
    if (err) {
      return console.log('Error connecting to the database: ' + err);
    }
    const db = client.db('occassionDB');
    const collection = db.collection('events');
    collection.updateOne({ _id: ObjectId(req.body.elemid) },
      {
        $pull: {
          seatingPlan: {
            roomNumber: req.body.roomNumber,
            tableNumber: req.body.tableNumber,
            seatedBy: ObjectId(req.body.seatedBy),
            seatNumber: req.body.seatNumber
          }
        }
      }
    );
  });
  res.redirect('/delevent');
});

// update Tischordnung

app.post('/update-placement', (req, res) => {
  const ObjectId = require('mongodb').ObjectId;
  const MongoClient = require('mongodb').MongoClient;
  const uri = 'mongodb://127.0.0.1:27017/';

  MongoClient.connect(uri, async function (err, client) {
    if (err) {
      return console.log('Error connecting to the database: ' + err);
    }
    const db = client.db('occassionDB');
    const collection = db.collection('events');
    const query = { _id: ObjectId(req.body.elemid), 'seatingPlan.roomNumber': req.body.roomNumber, 'seatingPlan.tableNumber': req.body.tableNumber };
    const setter = ({
      $set: {
        'seatingPlan.$[].typeoftableseat': req.body.seatorder
      }
    });
    await collection.updateOne(query, setter);
  });
  res.redirect('/delevent');
});

// update Tisch Form

app.post('/update-tableform', (req, res) => {
  const ObjectId = require('mongodb').ObjectId;
  const MongoClient = require('mongodb').MongoClient;
  const uri = 'mongodb://127.0.0.1:27017/';

  MongoClient.connect(uri, async function (err, client) {
    if (err) {
      return console.log('Error connecting to the database: ' + err);
    }
    const db = client.db('occassionDB');
    const collection = db.collection('events');
    const query = { _id: ObjectId(req.body.elemid), 'seatingPlan.roomNumber': req.body.roomNumber, 'seatingPlan.tableNumber': req.body.tableNumber };
    const setter = ({
      $set: {
        'seatingPlan.$[].tableform': req.body.tableform
      }
    });
    await collection.updateOne(query, setter);
  });
  res.redirect('/delevent');
});

// create rooms with tables

const room1 = new Room({
  name: 'Room 1',
  number: 1,
  description: 'A spacious room with natural light.',
  capacity: 30,
  numberOfTables: 3,
  tables: [
    {
      number: 1,
      availability: true,
      seatsAvailable: 4,
      typeoftableseat: 'undefined',
      tableform: 'rechteckiger Tisch'
    },
    {
      number: 2,
      availability: true,
      seatsAvailable: 4,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'

    },
    {
      number: 3,
      availability: true,
      seatsAvailable: 2,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    }
  ]
});

const room2 = new Room({
  name: 'Room 2',
  number: 2,
  description: 'A spacious room with natural light.',
  capacity: 30,
  numberOfTables: 4,
  tables: [
    {
      number: 5,
      availability: true,
      seatsAvailable: 4,
      typeoftableseat: 'undefined',
      tableform: 'rechteckiger Tisch'
    },
    {
      number: 6,
      availability: true,
      seatsAvailable: 4,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    },
    {
      number: 7,
      availability: true,
      seatsAvailable: 2,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    },
    {
      number: 8,
      availability: true,
      seatsAvailable: 2,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    }
  ]
});

const room3 = new Room({
  name: 'Room 3',
  number: 3,
  description: 'A spacious room with natural light.',
  capacity: 30,
  numberOfTables: 4,
  tables: [
    {
      number: 9,
      availability: true,
      seatsAvailable: 3,
      typeoftableseat: 'undefined',
      tableform: 'rechteckiger Tisch'
    },
    {
      number: 10,
      availability: true,
      seatsAvailable: 4,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    },
    {
      number: 11,
      availability: true,
      seatsAvailable: 2,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    },
    {
      number: 12,
      availability: true,
      seatsAvailable: 2,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    }
  ]
});

const room4 = new Room({
  name: 'Room 4',
  number: 4,
  description: 'A spacious room with natural light.',
  capacity: 30,
  numberOfTables: 4,
  tables: [
    {
      number: 13,
      availability: true,
      seatsAvailable: 4,
      typeoftableseat: 'undefined',
      tableform: 'rechteckiger Tisch'
    },
    {
      number: 14,
      availability: true,
      seatsAvailable: 4,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    },
    {
      number: 15,
      availability: true,
      seatsAvailable: 2,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
    },
    {
      number: 16,
      availability: true,
      seatsAvailable: 2,
      typeoftableseat: 'undefined',
      tableform: 'kreis Tisch'
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
