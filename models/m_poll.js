var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
	link: String,
	adminLink: String,

	title: String,
	choiceTitles: [String],
	choiceVoteCount: [Number],
	
	votedCookies: [Number],
	votedIps: [String], /* TODO I don't know what type the ips are saved as */

	voteLimit: Number,
	isIpRestricted: Boolean,
	isCookieRestricted: Boolean,

	voteEndingDate: Date,
	pollExpirationDate: Date,

	votersCanSeeResultsBefore: Boolean,
	votersCanSeeResultsAfter: Boolean,
	canSelectMultipleChoices: Boolean,
	
	pollIsOpen: Boolean,
	pollIsExpired: Boolean,
});

var Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll