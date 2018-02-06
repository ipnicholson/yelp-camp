const express = require('express');
const router = express.Router({mergeParams: true}); // pass through params
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// Comment NEW route
router.get('/new', middleware.isLoggedIn, function(req, res){
  // find campground by ID
  Campground.findById(req.params.id, function(err, foundCampground){
    if (err) {
      req.flash('error', 'Something went wrong. Please try again.');
      console.log(err);
    } else {
      res.render('comments/new', {campground: foundCampground});
    }
  }); 
});

// Comment CREATE route
router.post('/', middleware.isLoggedIn, function(req, res){
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, foundCampground){
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, newComment){
        if (err) {
          req.flash('error', 'Oops, something went wrong. Please try again.');
          console.log(err);
          res.redirect('/campgrounds');
        } else {
          // add username and ID to new comment
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          // save new comment
          newComment.save();
          // connect new comment to campground
          foundCampground.comments.push(newComment);
          // save comment
          foundCampground.save();
          console.log(newComment);
          // re-direct to corresponding campground show page
          req.flash('success', 'Comment added!');
          res.redirect('/campgrounds/' + foundCampground._id);
        }
      });
    }
  });
});

// Comment EDIT route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', 
        {
          campground_id: req.params.id,
          comment: foundComment
        }
      );
    }
  });
});

// Comment UPDATE route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// Comment DESTROY route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      res.redirect('back')
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

module.exports = router;