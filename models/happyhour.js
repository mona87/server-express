var mongoose = require('mongoose');
Schema = mongoose.Schema;

var happyhourSchema = new Schema({
	restaurant: {type: String, required: true},
	details: {type: String, required: true},
	address: {type: String, required:true },
	phone: {type: String, required: true},
	website: {type: String, required: true},
	latitude: {type: String, required: true},
	longitude: {type: String, required: true},
	users: {type: Array}
}, { collection : 'happyhour' });

var happyhour = mongoose.model('happyhour', happyhourSchema);

module.exports = {
	Happyhour: happyhour
}
