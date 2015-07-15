var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var expressLayouts=require("express-ejs-layouts") 
var happyhours = require('./routes/happyhours');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/nodetest');
mongoose.connect('mongodb://heroku_phttd0nr:khda7frstmlrus42aevgra6vud@ds047592.mongolab.com:47592/heroku_phttd0nr');

var app = express();



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  httpOnly: false

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//   secret: 'ssshhhhh',
//   resave: false,
//   saveUninitialized: false

// }));





app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if('OPTIONS' == req.method){
    res.sendStatus(200);
  }
  else{
  next();
  }
});

//passport config
var User = require('./models/user');
var Account = require('./models/account');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes);
app.get('/users', users.index);
// app.post('/users', users.create);
app.delete('/users',users.delete);
app.put('/users',users.update);
app.get('/users/:id', users.show);
app.get('/happyhours', happyhours.index);
app.put('/happyhours', happyhours.update);
app.post('/users', function(req, res) {

    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
             // return res.render("register", {message: "Sorry. That username already exists. Try again."});
              res.json({message: "That is not a valid username/password"});
        }
        else{
           passport.authenticate('local')(req, res, function () {
           
            res.json(req.user.username + ' authenticated\n\n' + req.user + '\n\n' + req.session.passport.user )
            // console.log()
        });
      }
          
    });
    console.log(res);
});


app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log('/login', req.user.username);
    req.session.test = req.user.username;
    req.session.blah = 'foo';
    console.log('/login', req.session);
    res.json({message: req.user.username + ' is logged in', username: req.user.username, id: req.user._id})

  });

app.get('/logout', function(req, res) {
  // console.log(req);
    req.logout();
   res.json({success: true});
});

// app.get('/me', function(req, res) {
//    console.log('/me', req.session);
//    req.session.teest2 = 'hello';
//    res.json({user: req.user});
//    // console.log(req.user)
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
