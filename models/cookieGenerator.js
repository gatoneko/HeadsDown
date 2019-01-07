var getRandomInt = require('../utilities/randomIntGenerator');


exports.createCookie = function(poll) {
	var id = getRandomInt(9999);
	console.log('id: ' + id);
	while (poll.cookieExists(id)) {
		id = getRandomInt(9999);
	}
	return id;
}