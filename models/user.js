var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: {type: String, required: true},
	password: {type: String },
	favorite: {type: Array},
	date: {type: Date, required: true, default: Date.now()}
})

User.methods.validPassword = function( pwd ) {
 
    return ( this.password === pwd );
}

// var user = mongoose.model('user', User);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

