var fs = require('fs');
var path = require('path');

var filePath = path.resolve(__dirname, 'noun-dictionary-list');
var text = fs.readFileSync(filePath).toString('utf-8');
var word_list = text.split('\n');
// word_list = word_list.slice(0,10);

module.exports = word_list;