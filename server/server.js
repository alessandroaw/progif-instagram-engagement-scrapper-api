const express = require('express');
const bodyParser = require('body-parser');
const scrapper = require('./scrapper/scrapper');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {mongoose} =  require('./db/mongoose');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');



var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Sign-up {email, password}
app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email','password']);
	var user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

// login {email, password}
app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email','password']);
	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send();
	});
});

// Delete token
app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}).catch((e) => {
		res.status(400).send(e);
	})
});

// app.get('/',)
app.get('/endorser/:username', authenticate, (req, res) => {
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
