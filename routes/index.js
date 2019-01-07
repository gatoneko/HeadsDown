var db = require('../models/linkDB');
var polls = require('../models/polls');
var cookieGenerator = require('../utilities/cookieGenerator.js');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { link: 'Heads Down', title: 'Heads Down' });
  res.redirect('/create_poll');
});

/* GET poll creation page. */
router.get('/create_poll', function(req, res, next) {
   res.render('create_poll'); 
});

/* GET results page. */
router.get('/:pollLink/results', async function(req, res, next) {
  var result = (await polls.getPoll(req.params.pollLink)).pollInfo;
  res.render('results', result);
});

/* user creates a poll */
router.post('/create_poll', async function(req, res, next) {
  var linkpair = await db.activateLinkPair();
  req.body.link = linkpair[0].name;
  req.body.adminLink = linkpair[1].name;
  await polls.addPoll(req.body);
  res.redirect('/' + linkpair[1].name);
});

/* user requests either poll or admin page */
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
  var currentPoll = (await polls.getPoll(req.params.pollLink)).pollInfo;
  //todo TEST THIS. This should use lazy evaluation to return left side if exists.
  var userCookieId = req.cookies.id || cookieGenerator.createCookie(currentPoll);
  await currentPoll.incrementChoice(req.body.choiceIndex, userCookieId, req.ip);
  //does this prevent expiring? todo look intoit
  res.cookie('id', userCookieId, { expires: new Date(Date.now() + 900000)});
  if (currentPoll.votersCanSeeResultsAfter) {
    res.redirect('/' + req.params.pollLink + '/results');
  } else {
    res.send('thank you for voting :)');
  }
});

module.exports = router;