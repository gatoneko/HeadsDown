var mongoose = require('mongoose');
var linkDB = require('./m_linkDB');

dburi = 'mongodb://datrukup:pokemon1@ds211694.mlab.com:11694/polls';
mongoose.connect(dburi);

linkDB.populateDB();

// process.exit(1);