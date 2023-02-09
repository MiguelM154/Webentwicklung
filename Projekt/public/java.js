function getData () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-event');
      for (let i = 0; i < objects.filteredEvents.length; i++) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = objects.filteredEvents[i].name;
        cell2.innerHTML = objects.filteredEvents[i].date;
        cell3.innerHTML = objects.filteredEvents[i].roomNumber;
      }
    }
    );
}
getData();

function getDataGuest () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const stringifiedObject = JSON.stringify(res);
      console.log(stringifiedObject);
      const objects = JSON.parse(stringifiedObject);
      console.log(objects);
      const table = document.getElementById('data-guest');
      for (let i = 0; i < objects.filteredEvents.length; i++) {
        for (let g = 0; g < objects.filteredEvents[i].guests.length; g++) {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          const cell5 = row.insertCell(4);
          cell1.innerHTML = objects.filteredEvents[i].name;
          cell2.innerHTML = objects.filteredEvents[i].guests[g].name;
          cell3.innerHTML = objects.filteredEvents[i].guests[g].status;
          cell4.innerHTML = objects.filteredEvents[i].guests[g].seatNumber;
          cell5.innerHTML = objects.filteredEvents[i].guests[g].email;
        }
      }
    }
    );
}
getDataGuest();

/* const table = document.getElementById('data-table');

console.log('test');

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(() => {
  const row = table.insertRow();
  const nameCell = row.insertCell(0);
  const ageCell = row.insertCell(1);
  const cityCell = row.insertCell(2);
  nameCell.innerHTML = 'test';
  ageCell.innerHTML = 'test';
  cityCell.innerHTML = 'test';
  const db = client.db('occassionDB');
  const collection = db.collection('Event');
  collection.find({}).toArray((err, data) => {
    if (err) return console.error(err);
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    client.close();
  });
});

Event.findOne({}).toArray(function (err, result) {
  if (err) throw err;
  const data = JSON.stringify(result);
  console.log(data);
  for (let i = 0; i < data.Event.length; i++) {
    console.log('test');
    const person = data.Event[i];
    const row = table.insertRow();
    const nameCell = row.insertCell(0);
    const ageCell = row.insertCell(1);
    const cityCell = row.insertCell(2);
    nameCell.innerHTML = person.Name;
    ageCell.innerHTML = person.date;
    cityCell.innerHTML = person.reserved;
  }
}); */
