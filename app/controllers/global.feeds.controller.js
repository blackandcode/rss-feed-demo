const _ = require('lodash');
const GlobalFeedSchema = require('../models/GlobalFeeds');
const UserFeedSchema = require('../models/UserFeeds');
const mongoose = require('mongoose');
const Feeds = mongoose.model('GlobalFeeds', GlobalFeedSchema);
const UserFeeds = mongoose.model('UserFeeds', UserFeedSchema);
const Parser = require('rss-parser');
const parser = new Parser();


/**
 * Get all Feeds for Single User for specific group
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
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