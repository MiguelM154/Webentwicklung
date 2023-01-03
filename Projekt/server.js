
const express = require('express');
const app = express();
const path = require('path');
const port = process.argv;
app.use(express.static('build/public'));

app.listen(port[2] || 8080, () => {

});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/index.html'));
});
