var wordList = require('../utilities/dictionary_list');
// var LinkModel = require('./linkModel');
var getRandomInt = require('../utilities/randomIntGenerator');
var mongoose = require('mongoose');


var LinkModel = mongoose.model('LinkModel');

function linkDB() {
  this.populateDB = function() {
    for (var i = 0; i < wordList.length; i++) {
      var linkObj = new LinkModel({
        name: wordList[i],
        inUse: false,
      });
      linkObj.save((err, result) => {
        return result;
      })
    }
  }
  this.activateLinkPair = async function() {
    var result = []
    var pollLink = await this.getUnusedLink();
    var adminLink = await this.getUnusedLink();
    result.push(pollLink);
    result.push(adminLink);
    return result;
  }

  /* Why don't we use findOne instead of the 
   * potentially costly find(which will check the whole talbe)?
   * If we just findOne, it will probably take the two first available alphabetically
   * This could be exploitable if a person can predict the links that have been used
   */
  this.getUnusedLink = async function() {
    var unusedLinks = await LinkModel.find({inUse: false}).exec();
    var count = unusedLinks.length;
    var result = this.selectRandomDoc(unusedLinks, count);
    result.inUse = true;
    await result.save();
    return result
  }

  this.selectRandomDoc = function(unusedLinks, max) {
    return unusedLinks[getRandomInt(max)];
  }

  this.recycleLink = async function(pollLink) {
    var link = await LinkModel.findOne({name: pollLink});
    link.inUse = false;
    await link.save();
  }

}

var db = new linkDB()

module.exports = db