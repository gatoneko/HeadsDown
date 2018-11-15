module.exports = function Poll(link, adminLink, title, choiceTitles, voteLimit, isIpRestricted, isCookieRestricted, voteEndingDate, pollExpirationDate, votersCanSeeResultsBefore, votersCanSeeResultsAfter, canSelectMultipleChoices) {
	
	this.link = link;
	this.adminLink = adminLink;

	this.title = title;
	this.choiceTitles = choiceTitles;
	this.choiceVoteCount = new Array(choiceTitles.length).fill(0);
	
	this.votedCookies = new Array();
	this.votedIps = new Array();

	this.voteLimit = voteLimit; //undefined === unlimited
	this.isIpRestricted = isIpRestricted;
	this.isCookieRestricted = isCookieRestricted;

	this.voteEndingDate = voteEndingDate; //Date object. Includes min & hour
	this.pollExpirationDate = pollExpirationDate; //When poll is deleted & link recycled

	this.votersCanSeeResultsBefore = votersCanSeeResultsBefore; // bf voitng bool
	this.votersCanSeeResultsAfter = votersCanSeeResultsAfter;
	this.canSelectMultipleChoices = canSelectMultipleChoices //boolean
	
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