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

	this.incrementChoice = function(choiceIndex, cookie, ip){
		console.log("isIpRestricted: " + this.isIpRestricted);
		console.log("object:" + this);
		if (!(this.isCookieRestricted || this.isIpRestricted)) {
			console.log("There are no restrictions: ");
			this.decideHowToIncrement(choiceIndex);
		}
		else if (
			(this.isCookieRestricted && !(this.cookieExists(cookie))) 
			||(this.isIpRestricted && !(this.ipExists(ip)))
			){
			/*TODO implement how to add a cookie if not yet*/
			console.log("Current restrictions: " + 
				this.isCookieRestricted + ", " +
				this.isIpRestricted);
			console.log("user cookie: " + cookie);
			console.log("user ip: " + ip);
			console.log("this user doesn't have restrictions, so adding");
			this.decideHowToIncrement(choiceIndex);
		}
		else {
			console.log("this user meets restrictions and can't vote");
		}
	}

	this.decideHowToIncrement = function(choiceIndex) {
		if (typeof choiceIndex === typeof []) {
			this.incrementManyChoices(choiceIndex);
		} else {
			this.incrementOneChoice(choiceIndex);
		}
	}

	this.addVotedCookie = function(cookieId) {
		this.votedCookies.push(cookieId);
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
}