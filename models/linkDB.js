var word_list = require('./dictionary_list');

function LinkDB(w_l){
	this.activeLinks = new Array();
	this.inactiveLinks = w_l

	this.activateLink = function() {
		var result = this.inactiveLinks[getRandomInt(this.inactiveLinks.length)]
		console.log("result: " + result);
		this.activeLinks.push(result);
		this.inactiveLinks = removeArrayElement(this.inactiveLinks, result);
		return result;
	};

	/* returns array of two links-- one for admin and one for vote */
	this.activateLinkPair = function() {
		var result = new Array();
		result.push(this.activateLink());
		result.push(this.activateLink());
		return result;
	}

	this.getActiveLinks = function () {
		return this.activeLinks;
	}

	//todo test this:
	this.isActive = function(query) {
		return this.activeLinks.find( element => element === query);
	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function removeArrayElement(arr, element) {
	var index = arr.indexOf(element);
	if (index !== -1) arr.splice(index, 1);
	return arr;
}

module.exports = new LinkDB(word_list);