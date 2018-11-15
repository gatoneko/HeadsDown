var db = require('../models/linkDB');
var polls = require('../models/polls');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));


/* Prevent favicon requests */
router.get('/favicon.ico', function(req, res) {
	res.status(204);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { link: 'Heads Down', title: 'Heads Down' });
});

router.get('/create_poll', function(req, res, next) {
	// res.send('todo');
	 res.render('create_poll', { link: 'Heads Down', title: 'Heads Down' }); 
});

router.post('/create_poll', function(req, res, next) {
	// console.log("req body is: ");
	// var title = req.body.title;
	// var choices = req.body.choices;
	// var link = db.activateLink();
	// polls.addPoll(link, title, choices);
	var linkpair = db.activateLinkPair();
	req.body.link = linkpair[0];
	req.body.adminLink = linkpair[1];
	console.log(req.body);
	polls.addPoll(req.body);
	// polls.addPoll(linkpair[0], linkpair[1], title, choices);
	// console.log('link: ' + link);
	/* TODO push that to a database */
	res.redirect('/' + linkpair[1]);
});

router.get(/\w+/, function(req, res, next) {
	console.log('path: ' + req.path);
	var linkKeyword = req.path.slice(1);
	/*TODO check if poll page exists */
	if (db.isActive(linkKeyword) !== undefined) {
		// console.log("it's there: " + linkKeyword);
		// res.send("it is there.");
		// return;
	}
	if (db.isActive(linkKeyword) === undefined) {
		// console.log("it's not there: " + linkKeyword);
		// res.send("it's not there.");
		// return;
	}
	var poll = polls.getPoll(linkKeyword);
	// console.log("current cookie: " + req.cookies.id);
	if (poll.isAdminLink(linkKeyword)) {
		res.render('poll_admin_page.ejs', poll);
	} else {
		res.render('poll_page.ejs', poll);		
	}
	/*TODO render poll page */
});

router.post('/:pollId(\\w+)', function(req, res, next) {

	var poll = polls.getPoll(req.params.pollId);
	// console.log('-------------------------------');
	// console.log("voted users before: " + poll.votedUsers);
	// console.log("req.cookies.id: " + req.cookies.id);
	if (poll.cookieExists(parseInt(req.cookies.id))) { 
		console.log("exists");
		// res.send('you can\'t vote twice'); 
		// res.redirect('/' + req.params.pollId);
	}
	else {
		var cookieId = getRandomInt(9999);
		poll.addVotedCookie(cookieId);
		res.cookie('id', cookieId, { expires: new Date(Date.now() + 900000)});
		// console.log("cookieid: " + cookieId);
		poll.incrementChoice(req.body.choiceIndex);
		/* todo: update database with find id with req.path
			and increment the vote number by one */
	}
	// console.log("voted users after: " + poll.votedUsers);	
	// console.log('-------------------------------');
	res.redirect('/' + req.params.pollId);

});


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = router;
