const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

// Define methods

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
        req.flash('error', `Oops, this is embrassing. Please try again ¯\_(ツ)_/¯ `);
        res.redirect('back');
      } else {
        // does user own campground?
        // console.log(foundCampground.author.id); // a mongoose object
        // console.log(req.user._id); //  a string
        if (foundCampground.author.id.equals(req.user._id)) { // .equals() is a mongoose method for comparison
          next();
        } else {
          req.flash('error', 'Only the original author can do that');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please Log in First');
    res.redirect('back') // takes user to previous page
  } 
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        // does user own comment?
        if (foundComment.author.id.equals(req.user._id)) { // ._id?
          next();
        } else {
          req.flash('error', 'Only comment author can edit');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please Log In');
    res.redirect('back');
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please Log In'); // add message to flash, displayed on next pageload
  res.redirect('/login');
}

module.exports = middlewareObj;