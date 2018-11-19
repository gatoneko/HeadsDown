var db = require('../models/linkDB');
// var polls = require('../models/polls');
var polls = require('../models/m_polls');
// var fraudCheck = require('../models/fraudCheckUtil.js')

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
  // res.render('index', { link: 'Heads Down', title: 'Heads Down' });
  res.redirect('/create_poll');
});

router.get('/create_poll', function(req, res, next) {
	 res.render('create_poll', { link: 'Heads Down', title: 'Heads Down' }); 
});

router.get('/:pollId/results', function(req, res, next) {
	var poll = polls.getPoll(req.params.pollId);
	res.render('results', poll);
})

router.post('/create_poll', function(req, res, next) {
	var linkpair = db.activateLinkPair();
	req.body.link = linkpair[0];
	req.body.adminLink = linkpair[1];
	console.log(req.body);
	polls.addPoll(req.body, function() {
		res.redirect('/' + linkpair[1]);
	});
	/* TODO push that to a database */
});

router.get(/\w+/, function(req, res, next) {
	console.log('path: ' + req.path);
	var linkKeyword = req.path.slice(1);
	// var poll = polls.getPoll(linkKeyword);
	polls.getPoll(linkKeyword, function(poll) {
		//bang is undefined or null falsy
		if (!poll) { //will this go to the 404?? 
			next();
			return;
		}
		// poll.checkVoteAndExpirationDates(Date.now());
		if (poll.isAdminLink(linkKeyword)) {
			res.render('poll_admin_page.ejs', poll);
		} else {
			res.render('poll_page.ejs', poll);		
		}
	});


});

router.post('/:pollId(\\w+)', function(req, res, next) {
	var poll = polls.getPoll(req.params.pollId);
	poll.checkVoteAndExpirationDates(Date.now());
	var userCookieId = poll.incrementChoice(req.body.choiceIndex, parseInt(req.cookies.id), req.ip);
	res.cookie('id', userCookieId, { expires: new Date(Date.now() + 900000)});
	// res.redirect('/' + req.params.pollId);
	res.redirect('/' + req.params.pollId + '/results');
});


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = router;
