const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  username: {
    type: String,
  },
  profilepic: {
    data: Buffer,
    contentType: String,
  },

  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store',
    },
  ],

  address: {
    homeaddress: {
      type: String,
    },
  },
  contactnumber: {
    type: Number,
    minLength: 4,
    maxLength: 15,
  },
  contactemail: {
    type: String,
  },
  followers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      username: {
        type: String,
      },
    },
  ],
  following: [
    {
      name: {
        type: String,
        default: null,
      },
      stores: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      malls: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },
  ],
  social: {
    whatsapp: {
      type: String,
    },
    facebook: {
      type: String,
    },

    instagram: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'item',
    },
  ],
  listeditems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store',
    },
  ],
  joinedmalls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'malls',
    },
  ],
});
module.exports = Profile = mongoose.model('profile', ProfileSchema);
