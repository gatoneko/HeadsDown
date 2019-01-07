var mongoose = require('mongoose');
var Polls = require('../models/m_polls.js');
var Poll = require('../models/m_poll.js');

var mongoDbURI='mongodb://datrukup:pokemon1@ds211694.mlab.com:11694/polls'
mongoose.connect(mongoDbURI);


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