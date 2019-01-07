var linkDB = require('./linkDB');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
  link: String,
  adminLink: String,

  title: String,
  choiceTitles: [String],
  choiceVoteCount: { type : Array , "default" : [] },
  
  votedCookies: [String],
  votedIps: [String],

  voteLimit: Number,
  isIpRestricted: Boolean,
  isCookieRestricted: Boolean,

  voteEndingDate: Date,
  pollExpirationDate: Date,

  votersCanSeeResultsBefore: Boolean,
  votersCanSeeResultsAfter: Boolean,
  canSelectMultipleChoices: Boolean,
  
  pollIsOpen: Boolean,
  pollIsExpired: Boolean,
});

pollSchema.methods.checkVoteAndExpirationDates = async function(timeOfQuery) {
  if (timeOfQuery > this.voteEndingDate) {
    await this.endPoll();
  } 

  if (timeOfQuery > this.pollExpirationDate) {
    await this.deletePoll();
    return null;
  }
  return this;
}

pollSchema.methods.cookieExists = function(cookieId) {
  //cookies are a string
  return this.votedCookies.includes(cookieId.toString());
}

pollSchema.methods.deletePoll = async function() {
  await linkDB.recycleLink(this.link);
  await linkDB.recycleLink(this.adminLink);
  await this.remove();
}

pollSchema.methods.endPoll = async function() {
  this.pollIsOpen = false;
  await this.save();
}

pollSchema.methods.incrementChoice = async function(choiceIndex, cookieId, ip){
  if (!(this.isAllowedToVote(cookieId, ip))) {
    return;
  }
  var voteToInc = this.choiceVoteCount[choiceIndex] + 1;
  this.choiceVoteCount.set(choiceIndex, voteToInc);
  /* For now the key is same as value */
  this.votedCookies.push(cookieId);
  this.votedIps.push(ip);
  await this.save();
}

pollSchema.methods.ipExists = function(ip) {
  return this.votedIps.includes(ip);
}

pollSchema.methods.isAllowedToVote = function(cookieId, ip) {
  var isAllowedToVote = true;
  if (this.isCookieRestricted && this.cookieExists(cookieId)){
    isAllowedToVote = false;  
  }
  if (this.isIpRestricted && this.ipExists(ip)) {
    isAllowedToVote = false;
  }
  return isAllowedToVote;
}

var Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll