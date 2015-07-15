var User = require('../models/user');


exports.index = function(req, res) {
  User.find({}, function(err, docs) {
    if(!err) {
      res.status(200).json({ users: docs });  
    } else {
      res.status(200).json({ message: err });
    }
  });
}

exports.create = function(req, res) {

  var name = req.body.username; // Name of user. 
  var age = req.body.password;  // user age

  //User.findOne({ name: name }, function(err, doc) {  // This line is case sensitive.
  User.findOne({ name: { $regex: new RegExp(name, "i") } }, function(err, doc) {  // Using RegEx - search is case insensitive
    if(!err && !doc) {
      
      var user = new User(); 

      user.name = name; 
      user.age = age; 
      // user.date = Date.now();
      
      user.save(function(err) {

        if(!err) {
          res.status(201).json({message: "User created with name: " + user.username });    
        } else {
          res.status(500).json({message: "Could not create user. Error: " + err});
        }

      });

    } else if(!err) {
      
      // User is trying to create a user with a name that already exists. 
      res.status(403).json({message: "User with that name already exists, please update instead of create or create a new user with a different name."}); 

    } else {
      res.status(403).json({ message: err});
    } 
  });

}

exports.update = function(req, res) {
  
  var id = req.body.id; 
  var username = req.body.username;
  var password = req.body.password; 
  var favorite = req.body.favorite;

  User.findById(id, function(err, doc) {
      if(!err && doc) {
        doc.username = username; 
        doc.password = password; 
        // doc.favorite.pop();
        var bool = true;
        if(doc.favorite.length === 0){
           doc.favorite.push(favorite);
        }
        else{
          for(var i = 0; i <doc.favorite.length; i++){
            console.log(doc.favorite[i])
            if(doc.favorite[i] === favorite){
              console.log(favorite);
                //only add the name if it doesn't exist
                //doc.users.push(favorite);     
                bool = false;  
            }
          }
        } 
      
      console.log(bool)
      if(bool){
        doc.favorite.push(favorite);
      }

        doc.save(function(err) {
          if(!bool){
              res.status(500).json({message: 'Restaurant already on favorite list'})
            }
          else if(!err) {
            res.status(200).json({message: "User updated: " + username});    
          } else {
            res.status(500).json( {message: "Could not update user. " + err});
          }  
        });
      } else if(!err) {
        res.status(404).json({ message: "Could not find user."});
      } else {
        res.status(500).json({ message: "Could not update user." + err});
      }
    }); 
}

exports.delete = function(req, res) {

  var id = req.body.id; 
  User.findById(id, function(err, doc) {
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

exports.show = function(req, res) {
  
  var id = req.params.id; // The id of the username the user wants to look up. 
  User.findById(id, function(err, doc) {
    if(!err && doc) {
      res.status(200).json(doc);
    } else if(err) {
      res.status(500).json({ message: "Error loading user." + err});
    } else {
      res.status(404).json({ message: "User not found."});
    }
  });
}



