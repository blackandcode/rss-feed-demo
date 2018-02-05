const UserSchema = require('../models/Users');
const mongoose = require('mongoose');
const User = mongoose.model('User', UserSchema);

exports.login = async (req, res, next) => {
	try {
		const {username, password} = req.body;
		const user = await User.findOneByUsername(username);
		const isAuthenticated = user.authenticate(username, password);

		if (!isAuthenticated) {
			res.status(304).json({ 
				success: false, 
				loggedIn: false, 
				msg: 'Cannot find user with given credentials' 
			});
			return;
		}
		console.log(user._id);
		res.cookie('userId', user._id);
		res.status(200).json({ 
			success: true, 
			loggedIn: true, 
			userId: user._id, 
			msg: 'User is successfully logged in' 
		});

	} catch(err) {
		return next(err);
	}
}

exports.logout = async (req, res, next) => {
	try {
		
		if (!req.cookies.userId) {
			res.status(400).status({ 
				success: false, 
				loggedIn: false,
				msg: 'User is already logged out'
			});
			return;
		}

		res.clearCookie('userId');
		res.status(200).json({ 
			success: true, 
			loggedIn: false,
			msg: 'User is successfully logged out' 
		});
		
	} catch(err) {
		return next(err);
	}
}

exports.authenticate = async (req, res, next) => {
	try {
		if (req.path === '/auth/login' || req.path === '/auth//logout' || (req.path === '/user' && req.method === 'POST')) {
			return next();
		}
	
		if (!req.cookies.userId) {
			console.log('here');
			res.status(401).json({success: false, msg: 'User must be logged in'});
			return;
		}
		next();
	} catch(err) {
		console.log(err);
		return next();
	}
}