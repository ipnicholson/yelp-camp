const mongoose = require('mongoose');
const passportLocaMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocaMongoose); // adds methods to our user

module.exports = mongoose.model('User', UserSchema);