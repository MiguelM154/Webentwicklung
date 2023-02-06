const jsonData = '{"people": [{"Name": "John Doe", "Age": 35, "City": "New York"},{"Name": "Jane Doe", "Age": 32, "City": "San Francisco"}]}';
const data = JSON.parse(jsonData);
const table = document.getElementById('data-table');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/occasionDB';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db('occasionDB');
  dbo.collection('Users').find({}).toArray(function(err, result) {
    if (err) throw err;
    var jsonData = JSON.stringify(result);
    console.log(jsonData);
    db.close();
  });
});

for (let i = 0; i < data.people.length; i++) {
  const person = data.people[i];

  const row = table.insertRow();
  const nameCell = row.insertCell(0);
  const ageCell = row.insertCell(1);
  const cityCell = row.insertCell(2);

  nameCell.innerHTML = person.Name;
  ageCell.innerHTML = person.Age;
  cityCell.innerHTML = person.City;
}
