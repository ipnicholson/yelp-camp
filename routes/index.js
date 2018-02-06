const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Root route
router.get('/', function(req, res){
  res.render('landing');
});

// Show register form
router.get('/register', function(req, res){
  res.render('register');
});

// Handle signup logic
router.post('/register', function(req, res){
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      req.flash('error', err.message); // use built-in error for flash messaging
      return res.redirect('register'); // exit callback in case of error, if error try passing err.message as object in return res.render
    }
    passport.authenticate('local')(req, res, function(){
      req.flash('success', `Welcome to YelpCamp, ${user.username}!`);
      res.redirect('/campgrounds');
    });
  });
});

// show login form
router.get('/login', function(req, res){
  res.render('login');
});

// handle login
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), function(req, res){
    // empty so far
});

// LOGOUT Route
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/campgrounds');
});

module.exports = router;
