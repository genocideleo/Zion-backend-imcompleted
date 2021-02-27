const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    minLength: 4,
    maxLength: 15,
  },

  date: { type: Date, default: Date.now },
});
module.exports = User = mongoose.model('user', UserSchema);
