const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware') // index.js will automatically be included from this dir

// INDEX - show all campgrounds
router.get('/', function(req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
  // get data from form and add to campgrounds array
  const newName = req.body.newName;
  const newPrice = req.body.newPrice;
  const newImage = req.body.newImage;
  const newDesc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {name: newName, price: newPrice, image: newImage, description: newDesc, author: author};
  // Create new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect('/campgrounds'); // Default re-direct is as a GET request
    }
  });
});

// NEW - display form to make new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
  // find campground with corresponding ID
  // render template with that campground
  res.render('campgrounds/new')
})

// SHOW - shows more info about one campground
router.get('/:id', function(req, res) {
  // find campground with provided ID
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      // render show template with that campground
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// EDIT CAMPGROUND
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
        req.flash('error', 'Campground does not exist');
      } else {
      res.render('campgrounds/edit', {campground: foundCampground});
      }
    });
});

// UPDATE CAMPGROUND
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
  // find and update correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  });
});

// DESTROY CAMPGROUND
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;