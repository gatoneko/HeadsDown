var word_list = require('./dictionary_list');

// var db = new LinkDB(word_list);
// for (var i = 0; i < 100; i++) {
// 	db.activateLink();
// }
// console.log("active: " + db.getActiveLinks());


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