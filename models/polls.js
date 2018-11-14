const util = require('util');
const Poll = require('./poll');

function PollArray(){
	this.polls = new Array();

	this.addPoll = function(l, al, t, c) {
		this.polls.push(new Poll(l, al, t, c));
	};
	
	this.getPoll = function(l) {
		var index = this.polls.findIndex(obj => {
			return obj.link === l || obj.adminLink === l;
		});
		return this.polls[index];
	};
}


module.exports = new PollArray();