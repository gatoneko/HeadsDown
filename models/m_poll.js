var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
	link: String,
	adminLink: String,

	title: String,
	choiceTitles: [String],
	choiceVoteCount: { type : Array , "default" : [] },
	
	votedCookies: [String],
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

/* for now not implementing multi-choice
pollSchema.methods.decideHowToIncrement = function(choiceIndex) {
	if (typeof choiceIndex === typeof []) {
		this.incrementManyChoices(choiceIndex);
	} else {
		this.incrementOneChoice(choiceIndex);
	}
}

pollSchema.methods.incrementManyChoices = function(choiceIndexArray) {
	for (var i = 0; i < choiceIndexArray; i++) {
		this.incrementChoice(choiceIndexArray[i]);
	}
}

pollSchema.methods.incrementOneChoice = function(choiceIndex) {
	this.choiceVoteCount[choiceIndex] += 1;
}
*/

pollSchema.methods.isAllowedToVote = function(cookieId, ip) {
	var isAllowedToVote = true;
	if (!(this.isCookieRestricted || this.isIpRestricted)) {
		console.log("There are no restrictions: ");
	}
	if (this.isCookieRestricted && this.cookieExists(cookieId)){
		isAllowedToVote = false;	
	}
	if (this.isIpRestricted && this.ipExists(ip)) {
		isAllowedToVote = false;
	}
	return isAllowedToVote;
}

/* for now ignoring all validation */
pollSchema.methods.incrementChoice = function(choiceIndex, cookieId, ip){
	var promise = new Promise((resolve, reject) => {
		if(!(this.isAllowedToVote(cookieId, ip))) {
			resolve();
		}
		else {
			var voteToInc = this.choiceVoteCount[choiceIndex] + 1;
			this.choiceVoteCount.set(choiceIndex, voteToInc);
			/* For now the key is same as value */
			this.votedCookies.push(cookieId);
			this.votedIps.push(ip);
			this.save();
			resolve();
		}
	});
	return promise;

// 	var promise = new Promise((resolve, reject) => {
// 		var numOfVotes = this.choiceVoteCount[choiceIndex];
// 		console.log(numOfVotes);
// 		var numOfVotes = numOfVotes + 1;
// 		console.log(numOfVotes);
// 		this.set({choiceVoteCount[choiceIndex]: numOfVotes});
// });
// 	return promise;

	// var isAllowedToVote = true;
	// var addedCookieId;
	// if (!(this.isCookieRestricted || this.isIpRestricted)) {
	// 	console.log("There are no restrictions: ");
	// }
	// if (this.isCookieRestricted && this.cookieExists(cookieId)){
	// 	isAllowedToVote = false;	
	// }
	// if (this.isIpRestricted && this.ipExists(ip)) {
	// 	isAllowedToVote = false;
	// }

	// // this.addVotedIp(ip);
	// // var addedCookieId = this.addCookie(cookieId)

	// if (isAllowedToVote) {
	// 	this.decideHowToIncrement(choiceIndex);
	// 	return addedCookieId;

	// } else {
	// 	console.log("this user meets restrictions and can't vote");
	// 	return cookieId;
	// }
}


// pollSchema.methods.endPoll = function() {
// 		this.pollIsOpen = false;
// 		return this.save();
// }

// /* When this method is called the first time, it will return vote page, next time will hang */
// pollSchema.methods.expirePoll = function() {
// 	this.pollIsOpen = false;
// 	return this.save();
// 	// return this.remove();
// }


// pollSchema.methods.deletePoll = function() {
// 	return this.remove();
// }


// pollSchema.methods.checkVoteAndExpirationDates = function(timeOfQuery) {
// 	if (timeOfQuery > this.voteEndingDate) {
// 		return this.endPoll()
// 		.then( () => {
// 			if (timeOfQuery > this.pollExpirationDate) {
// 				this.expirePoll(this);
// 			}
// 			resolve(null);
// 		});
// 	} 
// 	else {
// 		return Promise.resolve(this);
// 	}
// }


/* WORKING WITH ASYNC ETC
* ------------------------- */

pollSchema.methods.endPoll = async function() {
		this.pollIsOpen = false;
		await this.save();
}

/* When this method is called the first time, it will return vote page, next time will hang */
pollSchema.methods.expirePoll = function() {
	this.pollIsOpen = false;
	return this.save();
}


pollSchema.methods.checkVoteAndExpirationDates = async function(timeOfQuery) {
	if (timeOfQuery > this.voteEndingDate) {
		await this.endPoll();
	} 

	if (timeOfQuery > this.pollExpirationDate) {
		await this.deletePoll();
		return null;
	}
	return this;
}

/* -------------------------- */
pollSchema.methods.cookieExists = function(cookieId) {
	return this.votedCookies.includes(cookieId);
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

pollSchema.methods.ipExists = function(ip) {
	return this.votedIps.includes(ip);
}

pollSchema.methods.getLink = function() {
	return this.link;
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