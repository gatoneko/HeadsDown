var mongoose = require('mongoose');
var Polls = require('../models/m_polls.js');
var Poll = require('../models/m_poll.js');

var mongoDbURI='mongodb://datrukup:pokemon1@ds211694.mlab.com:11694/polls'
mongoose.connect(mongoDbURI);


// var pollObj = {
// 	link: 'String',
// 	adminLink: 'String',

// 	title: 'String',
// 	choiceTitles: ['String0', 'String1'],
// 	choiceVoteCount: [0,0],
	
// 	votedCookies: [],
// 	votedIps: [], /* TODO I don't know what type the ips are saved as */

// 	voteLimit: 999,
// 	isIpRestricted: false,
// 	isCookieRestricted: false,

// 	voteEndingDate: new Date("October 13, 2020 11:13:00"),
// 	pollExpirationDate: new Date("October 13, 2020 11:13:00"),

// 	votersCanSeeResultsBefore: false,
// 	votersCanSeeResultsAfter: false,
// 	canSelectMultipleChoices: false,
	
// 	pollIsOpen: true,
// 	pollIsExpired: false,
// }
/* Test creation of poll */
// var poll = Polls.addPoll(pollObj, function(results) {
// 	console.log('test');
// 	var l = results.getLink();
// 	console.log("link is: " + l);
// });


function checkIfNull(arg) {
	if (!arg) {
		return false;
	} else {
		return true;
	}
}

/* Test querying of poll */

var query = "penicillin";
// var query = "striker";

Polls.getPoll({link: query})
	.then((result) => {
		var vote = result.choiceVoteCount[0];
		vote++;
		result.choiceVoteCount.set(0, vote);
		result.save((err, updatedRes) => {
			if (err) console.log("err");
			console.log("updatedRes: " + updatedRes);
		});
	}
	);


// Poll.update({link: query}, {'$set' :
//  {'choiceVoteCount.0': 2}}, function(err, result){
// 	console.log(result);
// })

// Poll.update({link: query}, {'$inc' :
//  {'choiceVoteCount.1'}}, function(err, result){
// 	console.log(result);
// })