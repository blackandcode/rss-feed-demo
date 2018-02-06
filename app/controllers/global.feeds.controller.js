const _ = require('lodash');
const GlobalFeedSchema = require('../models/GlobalFeeds');
const UserFeedSchema = require('../models/UserFeeds');
const mongoose = require('mongoose');
const Feeds = mongoose.model('GlobalFeeds', GlobalFeedSchema);
const UserFeeds = mongoose.model('UserFeeds', UserFeedSchema);
const Parser = require('rss-parser');
const parser = new Parser();



exports.getSpecificFeeds = async (req, res, next) => {
	try {
		const specificFeeds = await Feeds.find({})
		.populate('User')
		.populate('UserFeeds')
		.where('user', req.cookies.userId)
		.where('group', req.body.groupId)

		const feeds = await parser.parseURL(req.body.url);

		if (!feeds) res.status(400).json({
			success: false,
			message: `cannot find feeds through this url: ${req.query.url}`
		});

		let allFeeds = []
		_.forEach(feeds.items, item => {
			allFeeds.push({
				title: item.title,
				description: item.content,
				url: item.link,
				createdAt: new Date(item.pubDate),
				user: req.cookies.userId,
				group: req.body.groupId
			});
		});

		const filteredFeeds = [];
		if (specificFeeds.length > 0) {
			_.forEach(allFeeds, thisFeed => {
				const filteredDbFeed = specificFeeds.filter(dbFeed => {
					return thisFeed.url === dbFeed.url;
				});
				if (filteredDbFeed.length > 0) {
					return;
				}
				filteredFeeds.push(thisFeed);
				return;
			});
			allFeeds = filteredFeeds;
		}

		
		const savedFeeds = await Feeds.insertMany(allFeeds);

		const responseFeeds = await Feeds.find({})
		.populate('User')
		.populate('UserFeeds')
		.where('user', req.cookies.userId)
		.where('group', req.body.groupId)

		return res.status(200).json({
			success: true,
			feeds: responseFeeds,
			message: allFeeds.length <= 0 ? 'No new feeds added' : 'New feeds added',
			total: responseFeeds.length
		});

	} catch(err) {
		return next(err);
	}
}

exports.getFeeds = async (req, res, next) => {
	try {
		const dbFeeds = await Feeds.find({}).sort({'_id': -1}).limit(26);

		const feeds = await parser.parseURL('https://www.reddit.com/.rss');

		let allFeeds = []
		_.forEach(feeds.items, item => {
			allFeeds.push({
				title: item.title,
				description: item.content,
				url: item.link,
				createdAt: new Date(item.pubDate)
			});
		});

		const filteredFeeds = [];
		if (dbFeeds.length > 0) {
			_.forEach(allFeeds, thisFeed => {
				const filteredDbFeed = dbFeeds.filter(dbFeed => {
					return thisFeed.url === dbFeed.url;
				});
				if (filteredDbFeed.length > 0) {
					return;
				}
				filteredFeeds.push(thisFeed);
				return;
			});
			allFeeds = filteredFeeds;
		}

		
		const savedFeeds = await Feeds.insertMany(allFeeds);
		res.status(200).json(allFeeds);
		// res.send('success');
	} catch(err) {
		console.log(err);
		return next(err);
	}
}

// update user feed
exports.update = async(req, res, next) => {
	try {
		const updatedFeed = await Feeds.findByIdAndUpdate(req.body.feedId, req.body.feed, {'new': true});
		res.status(200).json({ feed: updatedFeed, success: true });
	} catch(err) {
		return next(err);
	}
}

// remove user feed
exports.remove = async(req, res, next) => {
	try {
		const removedFeed = await Feeds.deleteMany()
		.populate('User')
		.where('url', req.body.url)
		.where('user', req.cookies.userId);

		res.status(200).json({ feed: removedFeed, success: true });
	} catch(err) {
		return next(err);
	}
}