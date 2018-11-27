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
}

module.exports = new linkDB();