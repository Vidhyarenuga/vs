/*-
Creating a schema for the courses 
used an array because each course is owned by many students
*/



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LangSchema = new Schema({
  title: String,
 

});

//--------module to export database---------
module.exports = mongoose.model('Language', LangSchema);
