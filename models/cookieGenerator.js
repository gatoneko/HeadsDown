exports.createCookie = function(poll) {
	var id = this.getRandomInt(9999);
	while (poll.cookieExists(id)) {
		id = this.thisgetRandomInt(9999);
	}
	return id;
}

exports.getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
}