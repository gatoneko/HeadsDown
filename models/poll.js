module.exports = function Poll(link, adminLink, title, choiceTitles) {
	this.link = link;
	this.adminLink = adminLink;
	this.title = title;
	this.choiceTitles = choiceTitles;
	this.choiceVoteCount = new Array(choiceTitles.length).fill(0);
	this.votedUsers = new Array();

	this.incrementChoice = function(choiceIndex) {
		this.choiceVoteCount[choiceIndex] += 1;
	}

	this.addVotedUser = function(cookieId) {
		this.votedUsers.push(cookieId);
		// for (var i = 0; i < this.votedUsers.length; i++) {
		// 	process.stdout.write(this.votedUsers[i]);
		// }
	}

	this.isAdminLink = function(query) {
		return query === this.adminLink;
	}

	this.userExists = function(cookieId) {
		console.log("users: " +this.votedUsers);
		console.log("cookieId: " + cookieId);
		// console.log(this.votedUsers.includes(cookieId));
		return this.votedUsers.includes(cookieId);
		// for (var i = 0; i < this.votedUsers.length; i++) {
		// 	console.log("array: " + this.votedUsers[i]);
		// 	console.log("argument: " + cookieId);
		// 	console.log("arraytype: " + typeof this.votedUsers[i]);
		// 	console.log("argumenttype: " + typeof cookieId);
		// 	console.log(this.votedUsers[i] === cookieId);
		// }
	}
}