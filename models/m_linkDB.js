var wordList = require('./dictionary_list');
var LinkModel = require('./linkModel');

console.log(wordList.length);

function linkDB() {
	this.populateDB = function() {
		for (var i = 0; i < wordList.length; i++) {
			var linkObj = new LinkModel({
				name: wordList[i],
				inUse: false,
			});
			linkObj.save((err, result) => {
				// console.log("savedLink: " + result);
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
		var unusedLinks = await LinkModel.find({inUse: false}).exec();
		var count = unusedLinks.length;
		console.log("count: " + count);
		var result = this.selectRandomDoc(unusedLinks, count);
		result.inUse = true;
		await result.save();
		return result
	}

	this.selectRandomDoc = function(unusedLinks, max) {
		return unusedLinks[getRandomInt(max)];
	}

}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = new linkDB();