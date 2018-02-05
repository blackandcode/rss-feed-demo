const UserSchema = require('../models/Users');
const mongoose = require('mongoose');
const User = mongoose.model('User', UserSchema);

// create a user
exports.create = async (req, res, next) => {
	const user = new User(req.body);

	try {
		
		const savedUser = await user.save();
		res.status(200).json(savedUser);

	} catch(err) {
		console.log(err);
		return next(err);
	}
}

// list all users
exports.list = async (req, res, next) => {
	try {
		const users = await User.find({});
		res.status(200).json(users);

	} catch(err) {
		console.log(err);
		return next(err);
	}
}

// get user by Id 
exports.userById = async (req, res, next) => {
	try {
		const id = req.cookies.userId ? req.cookies.userId : null;
		const user = await User.findOne({_id: id});
		res.status(200).json(user);

	} catch(err) {
		console.log(err);
		return next(err);
	}
}

// update the user
exports.update = async(req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(req.cookies.userId, req.body, { 'new': true });
		res.status(200).json(user);

	} catch(err) {
		console.log(err);
		return next(err);
	}
}

// remove the user
exports.remove = async(req, res, next) => {
	try {
		const user = await User.findOneAndRemove({_id: req.cookies.userId});
		res.status(200).json({user: user, success: true});
	} catch(err) {
		console.log(err);
		return next(err)
	}
}