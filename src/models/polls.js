var mongoose = require('mongoose');
var Poll = require('../models/poll.js');

function Polls(){

  this.addPoll = async function(paramObj) {
    var endDate = new Date();
    endDate.setMinutes(paramObj.voteEndingDate);//adds the minutes
    const oneWeek = 10080 //minutes
    var expireDate = new Date();
    expireDate.setMinutes(oneWeek);

    var newPoll = new Poll({
      link: paramObj.link,
      adminLink: paramObj.adminLink,

      title: paramObj.title || "",
      choiceTitles: paramObj.choiceTitles || [],
      choiceVoteCount: new Array(paramObj.choiceTitles.length).fill(0),

      votedCookies: new Array(),
      votedIps: new Array(),

      voteLimit: paramObj.voteLimit || 0, //undefined resolves to 0 which is unlimited
      isIpRestricted: paramObj.isIpRestricted || false,
      isCookieRestricted: paramObj.isCookieRestricted || false,

      voteEndingDate: endDate, //Date object. Includes min & hour
      pollExpirationDate: expireDate, //When poll is deleted & link recycled

      votersCanSeeResultsBefore: paramObj.votersCanSeeResultsBefore || false, // bf voting bool
      votersCanSeeResultsAfter: paramObj.votersCanSeeResultsAfter || false,
      canSelectMultipleChoices: paramObj.canSelectMultipleChoices || false, //boolean
      
      pollIsOpen: true,
      pollIsExpired: false,
    });

    await newPoll.save(newPoll);
  }

  this.getPoll = async function(queryLink) {
    var adminQuery = {adminLink: queryLink};
    var pollPageQuery = {link: queryLink};

    var pollResult = await Poll.findOne(pollPageQuery).exec();
    var adminResult = await Poll.findOne(adminQuery).exec();

    var queryCompositeResult = pollResult || adminResult;
    var isMainLink = pollResult ? true : false;
    
    if (queryCompositeResult) {
      queryCompositeResult = await queryCompositeResult.checkVoteAndExpirationDates(new Date());
    }

    var result = {};
    result.pollInfo = queryCompositeResult;
    result.isMainLink = isMainLink;
    return result;
  }
}

module.exports = new Polls();
