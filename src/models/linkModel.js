var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkKeywordSchema = new Schema({
  name: String,
  inUse: Boolean
});


var LinkModel = mongoose.model('LinkModel', linkKeywordSchema);

module.exports = LinkModel;