var {User} = require('./../models/user');
var authenticate = (req, res, next) => {
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if(!user){
			return Promise.reject();
		}

		req.user = user;
		req.token = token;
		next();
	}).catch((e) => {
		var error = {
			code:401,
			message:'Not Authorized! check https://frozen-ravine-57663.herokuapp.com/'
		};
		res.status(401).send(error);
	});
};

module.exports = {authenticate};
