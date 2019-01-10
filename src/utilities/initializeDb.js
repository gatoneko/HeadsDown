var fs = require('fs');
var mongoose = require('mongoose');
var LinkModel = require('../models/LinkModel');
var linkDB = require('../models/linkDB');

module.exports = function() {
	/* put your database credentials textfile path here */
	/* ------------------------------------------------ */
	var dbCredentials = './utilities/configdb.txt';
	/* ------------------------------------------------ */

	mongoose.Promise = global.Promise;
	var mongoDbURI = fs.readFileSync(dbCredentials, 'utf8');
	console.log(mongoDbURI);
	mongoose.connect(mongoDbURI);

	LinkModel.countDocuments({}, (err, count) => {
		console.log('the count is: ' + count);
		if (count === 0) linkDB.populateDB();
	})
}