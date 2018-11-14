var polls = require('./polls');
const util = require('util');


polls.addPoll("alpha", "title?", ['yes', 'no']);
polls.addPoll("beta", "title2?", ['yesb', 'nob']);
polls.addPoll("gamma", "maybe?", ['yesg', 'nog']);
console.log("current polls are: " + util.inspect(polls));


// polls.incrementChoice(polls.getPoll('alpha'), 1);

var myPoll = polls.getPoll("alpha");
myPoll.addVotedUser(11);
myPoll.addVotedUser(12);
myPoll.addVotedUser(13);
myPoll.addVotedUser(14);

console.log(myPoll.userExists(14));