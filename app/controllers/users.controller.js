const UserSchema = require('../models/Users');
const mongoose = require('mongoose');
const User = mongoose.model('User', UserSchema);

/**
 * Create a user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
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

/**
 * List all users
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.list = async (req, res, next) => {
	try {
		const users = await User.find({});
		res.status(200).json(users);

	} catch(err) {
		console.log(err);
		return next(err);
	}
}

/**
 * Get user by Id
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.userById = async (req, res, next) => {
	try {
		const id = req.cookies.userId ? req.cookies.userId : null;
		const user = await User.findOne({_id: id});
		res.status(200).json({
			data: {
				status: true,
				user: user
			}
		});

	} catch(err) {
		console.log(err);
		return next(err);
	}
}

/**
 * Update the user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.update = async(req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(req.cookies.userId, req.body, { 'new': true });
		res.status(200).json(user);

	} catch(err) {
		console.log(err);
		return next(err);
	}
}

/**
 * Remove the user
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.remove = async(req, res, next) => {
	try {
		const user = await User.findOneAndRemove({_id: req.cookies.userId});
		res.clearCookie('userId');
		res.status(200).json({user: user, success: true});
	} catch(err) {
		console.log(err);
		return next(err)
	}
}


// get user by Id
exports.userById = async (req, res, next) => {
    try {
        const id = req.cookies.userId ? req.cookies.userId : null;
        if (!id) {
            res.status(400).json({
                status: 0,
                message: 'User Not Found!'
            });
        }

        const user = await User.findOne({_id: id});
        res.status(200).json({
            status: 1,
            data: {
                id: user._id,
                name: user.username,
                username: user.username,
                token: 'e64a8ef5-42df-48d8-91f7-d1ef64a843c8',
                type: 'Admin',
                adminPermissions: [263, 200, 1, 2]
            }
        });

    } catch(err) {
        console.log(err);
        return next(err);
    }
}