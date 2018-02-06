const UserSchema = require('../models/UserFeeds');
const mongoose = require('mongoose');
const UserFeed = mongoose.model('UserFeeds', UserSchema);
const GlobalFeedSchema = require('../models/GlobalFeeds');
const Feeds = mongoose.model('GlobalFeeds', GlobalFeedSchema);

// get all user feeds
exports.getFeeds = async (req, res, next) => {
	try {
		const feeds = await UserFeed.find({})
		.populate('User')
		.where('user', req.cookies.userId)

		res.status(200).json({ feeds: feeds, success: true })

	} catch(err) {
		return next(err);
	}
}

// create user feeds
exports.setFeed = async(req, res, next) => {
	try {
		req.body.user = req.cookies.userId;
		console.log(req.body)
		const data = {
			title: req.body.feed.title,
			url: req.body.feed.url,
			user: req.body.user
		}
		const feed = new UserFeed(data);

		const userFeed = await feed.save();
		res.status(200).json({ feed: userFeed, success: true });
	} catch(err) {
		return next(err);
	}
}

// update user feed
exports.update = async(req, res, next) => {
	try {
		const updatedFeed = await UserFeed.findByIdAndUpdate(req.body.feedId, req.body.feed, {'new': true});
		res.status(200).json({ feed: updatedFeed, success: true });
	} catch(err) {
		return next(err);
	}
}

// remove user feed
exports.remove = async(req, res, next) => {
	try {
		const removedFeed = await UserFeed.findByIdAndRemove(req.body.feedId);
		res.status(200).json({ feed: removedFeed, success: true });
	} catch(err) {
		return next(err);
	}
}