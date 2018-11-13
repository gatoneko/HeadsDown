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
	console.log("req body is: ");
	console.log(req.body);
	var title = req.body.title;
	var choices = req.body.choices;
	var link = db.activateLink();
	polls.addPoll(link, title, choices);
	console.log('link: ' + link);
	/* TODO push that to a database */
	res.redirect('/' + link);
});

router.get(/\w+/, function(req, res, next) {
	console.log('path: ' + req.path);
	var linkKeyword = req.path.slice(1);
	/*TODO check if poll page exists */
	if (db.isActive(linkKeyword) !== undefined) {
		console.log("it's there: " + linkKeyword);
		// res.send("it is there.");
		// return;
	}
	if (db.isActive(linkKeyword) === undefined) {
		console.log("it's not there: " + linkKeyword);
		// res.send("it's not there.");
		// return;
	}
	var poll = polls.getPoll(linkKeyword);
	// console.log(poll);
	res.render('poll_page.ejs', poll);
	/*TODO render poll page */
});

router.post('/:pollId(\\w+)', function(req, res, next) {
	console.log('gotta increment');
	console.log(req.params.pollId);
	console.log("vote " + req.body.choiceIndex);

	var poll = polls.getPoll(req.params.pollId);

	poll.incrementChoice(req.body.choiceIndex);
	/* todo: update database with find id with req.path
		and increment the vote number by one */
	res.redirect('/' + req.params.pollId);

});

module.exports = router;
