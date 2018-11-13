var polls = require('./polls');
const util = require('util');


polls.addPoll("alpha", "title?", ['yes', 'no']);
polls.addPoll("beta", "title2?", ['yesb', 'nob']);
polls.addPoll("gamma", "maybe?", ['yesg', 'nog']);
console.log("current polls are: " + util.inspect(polls));


polls.incrementChoice(polls.getPoll('alpha'), 1);