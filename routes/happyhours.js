var Happyhour = require('../models/happyhour').Happyhour;

exports.index = function(req, res){
	Happyhour.find({}, function(err, docs){
		console.log('docs' +docs)
		if(!err){
			res.status(200).json({happyhours: docs});
		}
		else{
			res.status(200).json({message: err})
		}
	})
}

exports.update = function(req, res) {
  
  var username = req.body.username;
  var id = req.body.id;

  Happyhour.findById(id, function(err, doc) {
      if(!err && doc) {
      	doc.username = username;
	  
	        doc.save(function(err) {
	          if(!bool){

	          	res.status(500).json({message: 'Restaurant already on favorite list'})
	          }
	          else if(!err) {
	            res.status(200).json({message: "Restaurant updated: " + username});    
	          }
	          else {
	            res.status(500).json( {message: "Could not update restaurant. " + err});
	          }  
	        });
      } else if(!err) {
        res.status(404).json({ message: "Could not find restaurant."});
      } else {
        res.status(500).json({ message: "Could not update restaurant." + err});
      }
    }); 
}