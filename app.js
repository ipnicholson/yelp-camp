const express           = require('express'),
      ejs               = require('express'),
      bodyParser        = require('body-parser'),
      flash             = require('connect-flash'),
      methodOverride    = require('method-override'),
      mongoose          = require('mongoose'),
      passport          = require('passport'),
      LocalStrategy     = require('passport-local'),
      Campground        = require('./models/campground'),
      Comment           = require('./models/comment'),
      User              = require('./models/user'),
      seedDB            = require('./seeds');

// Requiring Routes
const commentRoutes     = require('./routes/comments'),
      campgroundRoutes  = require('./routes/campgrounds'),
      indexRoutes       = require('./routes/index');

const url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp-camp-v13' // if former is empty, latter is fallback
mongoose.connect(url);

// mongoose.connect('mongodb://localhost:27017/yelp-camp-v13'); // local development db

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public')); // serve the public directory
app.use(methodOverride('_method')); // look for '_method' in request
app.use(flash()); // flash messages
// seedDB(); // Seed db

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: `keep summer safe`,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to pass state to all templates: currentUser, flash messages
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes); // prepend /campgrounds to campgrounds routes
app.use('/campgrounds/:id/comments',commentRoutes);

// Development Server (local)
// app.listen(3000, function() {
//   console.log('YelpCamp server started on port 3000');
// });

// Production Server
app.listen(process.env.PORT, process.env.IP, function() {
  console.log('YelpCamp server started');
});