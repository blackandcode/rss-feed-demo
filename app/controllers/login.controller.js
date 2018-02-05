const UserSchema = require('../models/Users');
const mongoose = require('mongoose');
const User = mongoose.model('User', UserSchema);
const _ = require('lodash');

exports.login = async (req, res, next) => {
	try {
		const {username, password} = req.body;
		const user = await User.findOneByUsername(username);

		if(!user) {
			return res.status(400).json({ 
				success: false, 
				loggedIn: false, 
				msg: 'username not correct' 
			});
		}

		const isAuthenticated = user.authenticate(username, password);
		console.log(isAuthenticated);
		if (!isAuthenticated) {
			res.status(400).json({ 
				success: false, 
				loggedIn: false, 
				msg: 'password not correct' 
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
			console.log('now here');	
			return res.status(400).json({ 
				success: false, 
				loggedIn: false,
				msg: 'User is already logged out'
			});
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
	const nonSecurePaths = ['/auth/login', '/auth/logout']
	try {
		// if (_.includes(nonSecurePaths, req.path)) {
		// 	return next();
		// }
	
		if (!req.cookies.userId) {
			res.status(401).json({success: false, msg: 'User must be logged in'});
			return;
		}
		next();
	} catch(err) {
		return next(err);
	}
}