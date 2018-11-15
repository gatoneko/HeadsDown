module.exports = function Poll(paramObj) {
	this.link = paramObj.link;
	this.adminLink = paramObj.adminLink;

	this.title = paramObj.title;
	this.choiceTitles = paramObj.choiceTitles;
	this.choiceVoteCount = new Array(this.choiceTitles.length).fill(0);
	
	this.votedCookies = new Array();
	this.votedIps = new Array();

	this.voteLimit = paramObj.voteLimit; //undefined === unlimited
	this.isIpRestricted = paramObj.isIpRestricted;
	this.isCookieRestricted = paramObj.isCookieRestricted;

	this.voteEndingDate = paramObj.voteEndingDate; //Date object. Includes min & hour
	this.pollExpirationDate = paramObj.pollExpirationDate; //When poll is deleted & link recycled

	this.votersCanSeeResultsBefore = paramObj.votersCanSeeResultsBefore; // bf voting bool
	this.votersCanSeeResultsAfter = paramObj.votersCanSeeResultsAfter;
	this.canSelectMultipleChoices = paramObj.canSelectMultipleChoices //boolean
	
	this.pollIsOpen = true;

	this.incrementChoices = function(choiceIndexArray) {
		for (var i = 0; i < choiceIndexArray; i++) {
			this.incrementChoice(choiceIndexArray[i]);
		}
	}

	this.incrementChoice = function(choiceIndex) {
		this.choiceVoteCount[choiceIndex] += 1;
	}

	this.addVotedCookie = function(cookieId) {
		this.votedCookies.push(cookieId);
	}

	this.isAdminLink = function(query) {
		return query === this.adminLink;
	}

	this.cookieExists = function(cookieId) {
		return this.votedCookies.includes(cookieId);
	}

	this.getLink = function() {
		return this.link;
	}

	this.endPoll = function() {
		pollIsOpen = false;
	}

	this.setVotersCanSeeResultsBefore = function(boolArg) {
		this.votersCanSeeResultsBefore = boolArg;	
	}

	this.setVotersCanSeeResultsAfter = function(boolArg) {
 		this.votersCanSeeResultsAfter = boolArg;
	}
}