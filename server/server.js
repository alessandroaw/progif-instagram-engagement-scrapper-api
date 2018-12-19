const express = require('express');
const bodyParser = require('body-parser');
const scrapper = require('./scrapper/scrapper');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {mongoose} =  require('./db/mongoose');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
const hbs = require('hbs');
const path = require('path');



var app = express();
const port = process.env.PORT || 3000;


app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	var url = 'https://frozen-ravine-57663.herokuapp.com';
	res.render('index.hbs', {url});
});

// =================================
// AUTHENTICATION
// =================================

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
    var error = {
      code:400,
      message: e
    }
    res.status(400).send(e);
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


// =================================
// GET ENDORSER DATA DATA
// =================================
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
