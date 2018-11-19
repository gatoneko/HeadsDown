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


// pollSchema.methods.test = function() {
// 	console.log('hello world!');
// };

// pollSchema.methods.getLink = function() {
// 	console.log(this.link);
// 	return this.link;
// };

pollSchema.methods.incrementManyChoices = function(choiceIndexArray) {
	for (var i = 0; i < choiceIndexArray; i++) {
		this.incrementChoice(choiceIndexArray[i]);
	}
}

pollSchema.methods.incrementOneChoice = function(choiceIndex) {
	this.choiceVoteCount[choiceIndex] += 1;
}

pollSchema.methods.incrementChoice = function(choiceIndex, cookieId, ip){
	var isAllowedToVote = true;
	var addedCookieId;
	if (!(this.isCookieRestricted || this.isIpRestricted)) {
		console.log("There are no restrictions: ");
	}
	if (this.isCookieRestricted && this.cookieExists(cookieId)){
		isAllowedToVote = false;	
	}
	if (this.isIpRestricted && this.ipExists(ip)) {
		isAllowedToVote = false;
	}

	this.addVotedIp(ip);
	var addedCookieId = this.addCookie(cookieId)

	if (isAllowedToVote) {
		this.decideHowToIncrement(choiceIndex);
		return addedCookieId;

	} else {
		console.log("this user meets restrictions and can't vote");
		return cookieId;
	}
}

pollSchema.methods.decideHowToIncrement = function(choiceIndex) {
	if (typeof choiceIndex === typeof []) {
		this.incrementManyChoices(choiceIndex);
	} else {
		this.incrementOneChoice(choiceIndex);
	}
}

pollSchema.methods.addCookie = function(cookieId) {
	if (!cookieId) { //is NaN
		return this.addNewCookie();
	} else {
		this.addVotedCookie(cookieId);
		return cookieId;
	}
}

pollSchema.methods.addVotedCookie = function(cookieId) {
	if (!(this.cookieExists(cookieId))) { // only unique allowed
		this.votedCookies.push(cookieId);
	}
}

pollSchema.methods.addNewCookie = function() {
	var id = this.createCookieId();
	this.votedCookies.push(id);
	return id;
}

pollSchema.methods.createCookieId = function() {
	var id = this.getRandomInt(9999);
	while (this.cookieExists(id)) {
		id = this.thisgetRandomInt(9999);
	}
	return id;
}

pollSchema.methods.addVotedIp = function(ip) {
	this.votedIps.push(ip);
}

pollSchema.methods.isAdminLink = function(query) {
	return query === this.adminLink;
}

pollSchema.methods.cookieExists = function(cookieId) {
	return this.votedCookies.includes(cookieId);
}

pollSchema.methods.ipExists = function(ip) {
	return this.votedIps.includes(ip);
}

pollSchema.methods.getLink = function() {
	return this.link;
}

pollSchema.methods.endPoll = function() {
	this.pollIsOpen = false;
}

pollSchema.methods.expirePoll = function() {
	this.pollIsExpired = true;
}

pollSchema.methods.checkVoteAndExpirationDates = function(timeOfQuery) {
	if (timeOfQuery > this.voteEndingDate) {
		this.endPoll();
	}
	if (timeOfQuery > this.pollExpirationDate) {
		this.expirePoll();
	}
}

pollSchema.methods.isExpired = function() {
	return this.pollIsExpired;
}

pollSchema.methods.setVotersCanSeeResultsBefore = function(boolArg) {
	this.votersCanSeeResultsBefore = boolArg;	
}

pollSchema.methods.setVotersCanSeeResultsAfter = function(boolArg) {
		this.votersCanSeeResultsAfter = boolArg;
}

pollSchema.methods.getRandomInt = function(max) {
		return Math.floor(Math.random() * Math.floor(max));
}


var Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll