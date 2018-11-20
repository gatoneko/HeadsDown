var mongoose = require('mongoose');
var Poll = require('../models/m_poll.js');

function Polls(){

	this.addPoll = function(paramObj, callback) {
		var newPoll = new Poll({
			link: paramObj.link,
			adminLink: paramObj.adminLink,

			title: paramObj.title || "",
			choiceTitles: paramObj.choiceTitles || [],
			choiceVoteCount: new Array(paramObj.choiceTitles.length).fill(0),

			votedCookies: new Array(),
			votedIps: new Array(),

			voteLimit: paramObj.voteLimit || 0, //undefined resolves to 0 which is unlimited
			isIpRestricted: paramObj.isIpRestricted || false,
			isCookieRestricted: paramObj.isCookieRestricted || false,

			voteEndingDate: new Date(paramObj.voteEndingDate), //Date object. Includes min & hour
			pollExpirationDate: new Date (paramObj.pollExpirationDate), //When poll is deleted & link recycled

			votersCanSeeResultsBefore: paramObj.votersCanSeeResultsBefore || false, // bf voting bool
			votersCanSeeResultsAfter: paramObj.votersCanSeeResultsAfter || false,
			canSelectMultipleChoices: paramObj.canSelectMultipleChoices || false, //boolean
			
			pollIsOpen: true,
			pollIsExpired: false,
		});

		newPoll.save(function(err, newPoll) {
			console.log("newPoll: " + newPoll);
			callback(newPoll);
			return newPoll;
		});
	}

	this.getPoll = function(queryObj) {

		promise = new Promise((resolve, reject) => {
			Poll.findOne(queryObj).exec((err, result) => {
				if (result) {
					result.checkVoteAndExpirationDates(Date.now());
				}
				resolve(result);
			});
		});
		/* index.js is supposed to check if expire or not. currently commented */
		return promise;
	}
}

module.exports = new Polls();