/*-
Creating a schema for the courses 
used an array because each course is owned by many students
*/



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CountSchema = new Schema({
  nooflearner: Number,
  noofteacher: Number,
  noofcourse: Number
});

//--------module to export database---------
module.exports = mongoose.model('Count', CountSchema);
