module.exports = function Poll(link, title, choiceTitles) {
	this.link = link;
	this.title = title;
	this.choiceTitles = choiceTitles;
	this.choiceVoteCount = new Array(choiceTitles.length).fill(0);

	this.incrementChoice = function(choiceIndex) {
		this.choiceVoteCount[choiceIndex] += 1;
	}
}