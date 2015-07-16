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

exports.create = function(req, res) {
	// console.log(req);
  var restaurant = req.body.restaurant; // Name of user. 
  var details = req.body.details;  // user age
  var address = req.body.address; 
  var phone = req.body.phone; 
  var website = req.body.website; 
  var latitude = req.body.latitude; 
   var longitude = req.body.longitude; 
   console.log(req)
  //User.findOne({ name: name }, function(err, doc) {  // This line is case sensitive.
  Happyhour.findOne({ address: { $regex: new RegExp(address, "i") } }, function(err, doc) {  // Using RegEx - search is case insensitive
    if(!err && !doc) {
      
      
      var happyhour = new Happyhour(); 

      happyhour.restaurant = restaurant; 
      happyhour.details = details; 
      happyhour.address = address; 
      happyhour.phone = phone; 
      happyhour.website = website;  
      happyhour.latitude = latitude; 
      happyhour.longitude = longitude; 
      // user.date = Date.now();

      
      happyhour.save(function(err) {

        if(!err) {
          res.status(201).json({message: "restaurant created with name: " + restaurant });    
        } else {
          res.status(500).json({message: "Could not create restaurant. Error: " + err});
        }

      });

    } else if(!err) {
      
      // User is trying to create a user with a name that already exists. 
      res.status(403).json({message: "restaurant with that name already exists, please update instead of create or create a new restaurant with a different name."}); 

    } else {
      res.status(403).json({ message: err});
    } 
  });

}

exports.delete = function(req, res) {

  var id = req.body.id; 
  Happyhour.findById(id, function(err, doc) {
    if(!err && doc) {
      doc.remove();
      res.status(200).json({ message: "User removed."});
    } else if(!err) {
      res.status(404).json({ message: "Could not find user."});
    } else {
      res.status(403).json({message: "Could not delete user. " + err });
    }
  });
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