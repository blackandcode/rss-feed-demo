const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserFeedSchema = new Schema({
	title: String,
	description: String,
	url: String,
	createdAt: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

module.exports = UserFeedSchema;