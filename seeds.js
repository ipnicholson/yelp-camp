const mongoose    = require('mongoose'),
      Campground  = require('./models/campground'),
      Comment     = require('./models/comment');

const data = [
  {
    name: 'Kirk Creek', 
    image:'https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1477623546/campground-photos/ipmpoocf9zufxj3mrvc7.jpg',
    description: `Kirk Creek Campground is an oceanside paradise, with each site overlooking the Pacific Ocean. It offers a variety of opportunities for relaxation and recreation. The campground is within walking distance of the area's largest sandy beach and is close to a variety of scenic trails that lead visitors into the Los Padres National Forest.`
  },
  {
    name: 'Reyes Peak',
    image:'http://static.panoramio.com/photos/large/47706995.jpg',
    description: `Reyes Peak Campground at an elevation of 7,000 is situated along the southwest side of a ridge and consists of six campsites.  Each campsite contains a table, BBQ grill, and a fire ring. There is one pit toilet located near the first few campsites. No water is available at Reyes Peak. Make sure you bring plenty of water for your stay.
    Reyes Peak Campgrounds are surrounded Jeffrey Pines, Sugar Pines, White Fir and Little Ponderosa Pines. 
    The campgrounds provide breathtaking views of the area. You can see the Cuyama Badlands on one side and the ocean from the other side. On clear days you can even see some of the Channel Islands!`
  },
  {
    name: 'Salmon Creek',
    image:'http://www.californiasbestcamping.com/photos5/salmon_creek_camp.jpg',
    description: `Salmon Creek Campground is located in the North Yuba River area. Visitors enjoy a wide variety of recreational activities in the area, including hiking, hunting, fishing, canoeing and gold panning.`
  }
];

function seedDB() {
  // Remove everything from db      
  Campground.remove({}, function(err){
    if (err) {
      console.log(err)
    } else {
      console.log('removed campgrounds');
    }
    // add campgrounds
    data.forEach(function(seed){
      Campground.create(seed, function(err, addedCampground){
        if (err) {
          console.log(err);
        } else {
          console.log('added campground');
          // Create comments
          Comment.create(
            {
              text: 'this place is great but i wish there was internet to check instagram.',
              author: 'basicbetch247'
            }, function(err, addedComment){
              if (err) {
                console.log(err);
              } else {
                addedCampground.comments.push(addedComment);
                addedCampground.save();
                console.log('added new comment');
              }
          });
          Comment.create(
            {
              text: 'my precious',
              author: 'g0llum'
            }, function(err, addedComment){
              if (err) {
                console.log(err);
              } else {
                addedCampground.comments.push(addedComment);
                addedCampground.save();
                console.log('added new comment');
              }
          });
        }
      });
    });
  });
}

module.exports = seedDB;