var db = require('../models/linkDB');
// var polls = require('../models/polls');
var polls = require('../models/m_polls');
var cookieGenerator = require('../models/cookieGenerator.js');
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

/* GET poll creation page. */
router.get('/create_poll', function(req, res, next) {
	 res.render('create_poll', { link: 'Heads Down', title: 'Heads Down' }); 
});

/* GET results page. */
router.get('/:pollLink/results', async function(req, res, next) {
	var result = (await polls.getPoll(req.params.pollLink)).pollInfo;
	res.render('results', result);

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

router.get(/\w+/, async function(req, res, next) {
	var linkKeyword = req.path.slice(1);
	var result = await polls.getPoll(linkKeyword);
	if (!result.pollInfo) {next(); }
	if (result.isMainLink) {
		res.render('poll_page.ejs', result.pollInfo);
	} else {
		res.render('poll_admin_page.ejs', result.pollInfo);
	}
});



/* user votes on a choice */
router.post('/:pollLink(\\w+)', async function(req, res, next) {


	//todo TEST THIS. This should use lazy evaluation to return left side if exists.
	console.log(userCookieId);

	var currentPoll = (await polls.getPoll(req.params.pollLink)).pollInfo;

	var userCookieId = req.cookies.id || cookieGenerator.createCookie(currentPoll);

	// var userCookieId;
	// if (!req.cookies.id) {
	// 	userCookieId = cookieGenerator.createCookie(currentPoll);
	// } 
	// else {
	// 	userCookieId = req.cookies.id;
	// }	
	// var currentPoll = currentPoll.pollInfo;
	console.log("currentPoll: " + currentPoll);
	await currentPoll.incrementChoice(req.body.choiceIndex, userCookieId, req.ip);
	//does this prevent expiring? todo look intoit
	res.cookie('id', userCookieId, { expires: new Date(Date.now() + 900000)});
	res.redirect('/' + req.params.pollLink + '/results');

	// var userCookieId = poll.incrementChoice(req.body.choiceIndex, parseInt(req.cookies.id), req.ip);
	// res.cookie('id', userCookieId, { expires: new Date(Date.now() + 900000)});
});


// /* user votes on a choice */
// router.post('/:pollLink(\\w+)', function(req, res, next) {
// 	var userCookieId;	

// 	polls.getPoll({link: req.params.pollLink})
// 		.then((poll) => {
// 			// poll.checkVoteAndExpirationDates(new Date());
// 			if (!req.cookies.id) {
// 				userCookieId = cookieGenerator.createCookie(poll)
// 			} 
// 			else {
// 				userCookieId = req.cookies.id;
// 			}		
// 			poll.incrementChoice(req.body.choiceIndex, userCookieId, req.ip)
// 		})
// 		.then(() => {
// 				// res.cookie('id', userCookieId, { expires: new Date(Date.now() + 900000)});
// 				res.redirect('/' + req.params.pollLink + '/results');
// 			})
// 			// var userCookieId = poll.incrementChoice(req.body.choiceIndex, parseInt(req.cookies.id), req.ip);
// 			// res.cookie('id', userCookieId, { expires: new Date(Date.now() + 900000)});
// });


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = router;
