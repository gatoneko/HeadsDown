const util = require('util');
const Poll = require('./poll');

function PollArray(){
	this.polls = new Array();

	this.addPoll = function(l, t, c) {
		this.polls.push(new Poll(l, t, c));
	};
	this.getPoll = function(l) {
		var index = this.polls.findIndex(obj => {
			return obj.link === l;
		});
		return this.polls[index];
	};
}


module.exports = new PollArray();