var mongoose = require('mongoose');
var Polls = require('../models/m_polls.js');

var mongoDbURI='mongodb://datrukup:pokemon1@ds211694.mlab.com:11694/polls'
mongoose.connect(mongoDbURI);

var pollObj = {
	link: 'String',
	adminLink: 'String',

	title: 'String',
	choiceTitles: ['String0', 'String1'],
	choiceVoteCount: [0,0],
	
	votedCookies: [],
	votedIps: [], /* TODO I don't know what type the ips are saved as */

	voteLimit: 999,
	isIpRestricted: false,
	isCookieRestricted: false,

	voteEndingDate: new Date("October 13, 2020 11:13:00"),
	pollExpirationDate: new Date("October 13, 2020 11:13:00"),

	votersCanSeeResultsBefore: false,
	votersCanSeeResultsAfter: false,
	canSelectMultipleChoices: false,
	
	pollIsOpen: true,
	pollIsExpired: false,
}

var poll = Polls.addPoll(pollObj);


