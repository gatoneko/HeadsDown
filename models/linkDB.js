var wordList = require('./dictionary_list');
var LinkModel = require('./linkModel');
var getRandomInt = require('../utilities/randomIntGenerator');

// console.log(wordList.length);

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

	this.getUnusedLink = async function() {
		/* potentially costly-- gets all unused then picks one */
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