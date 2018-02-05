const _ = require('lodash');
const GlobalFeedSchema = require('../models/GlobalFeeds');
const mongoose = require('mongoose');
const Feeds = mongoose.model('GlobalFeeds', GlobalFeedSchema);
const Parser = require('rss-parser');
const parser = new Parser();

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