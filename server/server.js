const express = require('express');
const bodyParser = require('body-parser');
const scrapper = require('./scrapper/scrapper');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/:username', (req, res) => {
  var username = req.params.username;
  scrapper.getUserData(username)
  .then((user) => {
    res.send(user);
  })
  .catch((e) => {
    res.status(400).send(e);
  });

});

app.listen(port, () => {
  console.log('Server running on port ' + port);
})
