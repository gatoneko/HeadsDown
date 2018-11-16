module.exports = function Poll(paramObj) {
	this.link = paramObj.link;
	this.adminLink = paramObj.adminLink;

	this.title = paramObj.title || "";
	this.choiceTitles = paramObj.choiceTitles || [];
	this.choiceVoteCount = new Array(this.choiceTitles.length).fill(0);
	
	this.votedCookies = new Array();
	this.votedIps = new Array();

	this.voteLimit = paramObj.voteLimit || 0; //undefined resolves to 0 which is unlimited
	this.isIpRestricted = paramObj.isIpRestricted || false;
	this.isCookieRestricted = paramObj.isCookieRestricted || false;

	this.voteEndingDate = paramObj.voteEndingDate; //Date object. Includes min & hour
	this.pollExpirationDate = paramObj.pollExpirationDate; //When poll is deleted & link recycled

	this.votersCanSeeResultsBefore = paramObj.votersCanSeeResultsBefore || false; // bf voting bool
	this.votersCanSeeResultsAfter = paramObj.votersCanSeeResultsAfter || false;
	this.canSelectMultipleChoices = paramObj.canSelectMultipleChoices || false; //boolean
	
	this.pollIsOpen = true;

	this.incrementManyChoices = function(choiceIndexArray) {
		for (var i = 0; i < choiceIndexArray; i++) {
			this.incrementChoice(choiceIndexArray[i]);
		}
	}

	this.incrementOneChoice = function(choiceIndex) {
		this.choiceVoteCount[choiceIndex] += 1;
	}

	this.incrementChoice = function(choiceIndex, cookieId, ip){
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

	this.decideHowToIncrement = function(choiceIndex) {
		if (typeof choiceIndex === typeof []) {
			this.incrementManyChoices(choiceIndex);
		} else {
			this.incrementOneChoice(choiceIndex);
		}
	}

	this.addCookie = function(cookieId) {
		if (!cookieId) { //is NaN
			return this.addNewCookie();
		} else {
			this.addVotedCookie(cookieId);
			return cookieId;
		}
	}

	this.addVotedCookie = function(cookieId) {
		if (!(this.cookieExists(cookieId))) { // only unique allowed
			this.votedCookies.push(cookieId);
		}
	}

	this.addNewCookie = function() {
		var id = this.createCookieId();
		this.votedCookies.push(id);
		return id;
	}

	this.createCookieId = function() {
		var id = this.getRandomInt(9999);
		while (this.cookieExists(id)) {
			id = this.thisgetRandomInt(9999);
		}
		return id;
	}

	this.addVotedIp = function(ip) {
		this.votedIps.push(ip);
	}

	this.isAdminLink = function(query) {
		return query === this.adminLink;
	}

	this.cookieExists = function(cookieId) {
		return this.votedCookies.includes(cookieId);
	}

	this.ipExists = function(ip) {
		return this.votedIps.includes(ip);
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

	this.getRandomInt = function(max) {
  		return Math.floor(Math.random() * Math.floor(max));
	}
}