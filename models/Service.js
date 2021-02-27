const mongoose = require('mongoose');
const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store',
  },
  workinghours: {
    from: { type: String },
    to: { type: String },
  },
  avgrating: {
    type: Number,
  }, //to be modi
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      profilepic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      text: {
        type: String,
        required: true,
      },
      likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  date: { type: Date, default: Date.now },
});
module.exports = Service = mongoose.model('service', ServiceSchema);
