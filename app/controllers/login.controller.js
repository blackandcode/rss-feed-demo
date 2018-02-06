const UserSchema = require('../models/Users');
const mongoose = require('mongoose');
const User = mongoose.model('User', UserSchema);
const _ = require('lodash');

/**
 * Login user to the system
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
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
			status: 1,
			data: {
				loggedIn: true,
				id: user._id,
				name: user.username,
				username: user.username,
				token: 'e64a8ef5-42df-48d8-91f7-d1ef64a843c8',
				type: 'Admin',
				adminPermissions: [263, 200, 1, 2]
			},

			msg: 'User is successfully logged in',

		});

	} catch(err) {
		return next(err);
	}
}

/**
 * Logout the user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.logout = async (req, res, next) => {
	try {

		if (!req.cookies.userId) {
			console.log('now here');	
			return res.status(400).json({
				status: 2, 
				success: false, 
				loggedIn: false,
				msg: 'User is already logged out'
			});
		}

		res.clearCookie('userId');
		res.status(200).json({ 
			status: 2,
			success: true, 
			loggedIn: false,
			msg: 'User is successfully logged out' 
		});
		
	} catch(err) {
		return next(err);
	}
}

/**
 * This is middlware that is applied to the routs so anonymouse user can't access
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
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