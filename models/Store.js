const mongoose = require('mongoose');
const StoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  username: {
    type: String,
  },
  storename: {
    type: String,
  },
  storepic: {
    data: Buffer,
    contentType: String,
  },
  wallpaper: {
    data: Buffer,
    contentType: String,
  },

  sdescription: {
    type: String,
    required: true,
  },
  provideservice: {
    type: Boolean,
    default: false,
  },
  listeditems: [
    {
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item',
      },
      thumbnail: {
        data: Buffer,
        contentType: String,
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
      // avgrating: {
      //   type: Number,
      // },
    },
  ],

  // service: [
  //   {
  //     name: {
  //       type: String,
  //       required: true,
  //       unique: true,
  //     },
  //     price: {
  //       type: Number,
  //       required: true,
  //     },
  //     description: {
  //       type: String,
  //       required: true,
  //     },
  //     provider: {
  //       type: mongoose.Schema.Types.ObjectId,
  //     },
  //     avgrating: {
  //       type: Number,
  //     }, //to be modi
  //     comments: [
  //       {
  //         user: {
  //           type: mongoose.Schema.Types.ObjectId,
  //         },
  //         profilepic: {
  //           type: mongoose.Schema.Types.ObjectId,
  //           ref: 'user',
  //         },
  //         text: {
  //           type: String,
  //           required: true,
  //         },
  //         likes: {
  //           type: mongoose.Schema.Types.ObjectId,
  //           ref: 'user',
  //         },
  //         date: {
  //           type: Date,
  //           default: Date.now,
  //         },
  //       },
  //     ],

  //     date: { type: Date, default: Date.now },
  //   },
  // ],

  storeaddress: {
    type: String,
  },
  storenumber: {
    type: Number,
    minLength: 4,
    maxLength: 15,
    required: true,
  },
  storeemail: {
    type: String,
  },
  storefollowers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      username: {
        type: String,
      },
    },
  ],
});
module.exports = Store = mongoose.model('store', StoreSchema);
