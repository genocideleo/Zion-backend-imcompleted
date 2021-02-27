const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store',
  },
  seller: {
    type: String,
  },
  thumbnail: {
    data: Buffer,
    contentType: String,
  },
  pictures: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],

  avgrating: {
    type: Number,
  }, //to be modi
  date: { type: Date, default: Date.now },

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      username: {
        type: String,
      },
      profilepic: {
        data: Buffer,
        contentType: String,
      },
      text: {
        type: String,
        required: true,
      },
      likes: {
        type: mongoose.Schema.Types.ObjectId,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
module.exports = Item = mongoose.model('item', ItemSchema);
