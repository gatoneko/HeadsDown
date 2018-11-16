const util = require('util');
const Poll = require('./poll');

function PollArray(){
	this.polls = new Array();

	this.addPoll = function(paramObj) {
		this.polls.push(new Poll(paramObj));
	};

	this.removePoll = function(index) {
		if (index > -1) {
  			this.polls.splice(index, 1);
		}
	};
	
	this.getPoll = function(l) {
		var index = this.polls.findIndex(obj => {
			return obj.link === l || obj.adminLink === l;
		});
		var targetPoll = this.polls[index];
		targetPoll.checkVoteAndExpirationDates(Date.now());
		if (targetPoll.isExpired()) {
			this.removePoll(index);
			return null;
		} else {
			return targetPoll;
		}
	};
}


module.exports = new PollArray();