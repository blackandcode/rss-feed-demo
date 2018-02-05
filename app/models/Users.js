const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	username:{
		type: String,
		trim: true,
		unique: true,
		required: true,
		index: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	}
});

UserSchema.statics.findOneByUsername = function(username) {
	return this.findOne({username: username});
}

UserSchema.methods.authenticate = function(username, password) {
	return this.password === password && this.username === username;
}

module.exports = UserSchema;