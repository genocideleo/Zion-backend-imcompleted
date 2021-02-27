const mongoose = require('mongoose');
const StoreSchema = new mongoose.Schema({
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],

  mallpic: {
    data: Buffer,
    contentType: String,
  },
  wallpaper: {
    data: Buffer,
    contentType: String,
  },

  description: {
    type: String,
  },
  haveservice: {
    type: Boolean,
    default: false,
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'store',
    },
  ],
  listeditems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'item',
    },
  ],
  listedservices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service',
    },
  ],

  mallfollowers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});
module.exports = Store = mongoose.model('store', StoreSchema);
