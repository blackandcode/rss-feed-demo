const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GlobalFeedSchema = new Schema({
	title: String,
	description: String,
	url: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	group: {
		type: Schema.ObjectId,
		ref: 'UserFeeds'
	}
});

module.exports = GlobalFeedSchema;