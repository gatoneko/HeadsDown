var fs = require('fs');
var path = require('path');

var filePath = path.resolve(__dirname, 'noun-dictionary-list');
var text = fs.readFileSync(filePath).toString('utf-8');
var word_list = text.split('\n');
// console.log(word_list);

module.exports = word_list;