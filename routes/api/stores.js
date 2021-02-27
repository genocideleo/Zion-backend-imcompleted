const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const { check, validationResult } = require('express-validator');
//tunah hrih cuan profile tin in store 1 cauh nei thei in ka siam hrih

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Store = require('../../models/Store');
const Item = require('../../models/Item');
const { ContactsOutlined } = require('@material-ui/icons');

// @route  GET api/stores/mystore
// @desc   Get current user's store
// @access Private
router.get('/mystore', auth, async (req, res) => {
  try {
    //4/2-4:00
    const store = await Store.findOne({
      user: req.user.id,
    });
    if (!store) {
      return res
        .status(400)
        .json({ msg: 'This user is does not have any store' });
    }
    return res.json(store);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/stores/mystore
// @desc   Add or update store by user id
// @access Private
router.post(
  '/mystore',
  [
    auth,
    [
      check('storename', 'Please add Store name').not().isEmpty(),
      check('sdescription', 'Please add description').not().isEmpty(),
      check(
        'storenumber',
        'Please add a phone number for your buyers to contact you between 4 and 15 digits'
      )
        .not()
        .isEmpty()
        .isLength({ min: 4, max: 15 }),
      check('storeemail', 'Please enter a valid email').isEmail(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      storepic,
      storename,
      wallpaper,
      sdescription,
      storeaddress,
      storenumber,
      storeemail,
    } = req.body;
    const storeFields = {};
    storeFields.user = req.user.id;
    const username = await User.findOne({ _id: req.user.id }, 'username -_id');
    storeFields.username = username.username;

    if (storepic) storeFields.storepic = storepic;
    if (storename) storeFields.storename = storename;
    if (wallpaper) storeFields.wallpaper = wallpaper;
    if (sdescription) storeFields.sdescription = sdescription;
    if (storeaddress) storeFields.storeaddress = storeaddress;
    if (storenumber) storeFields.storenumber = storenumber;
    if (storeemail) storeFields.storeemail = storeemail;

    try {
      // Using upsert option (creates new doc if no match is found):
      let store = await Store.findOneAndUpdate(
        { user: req.user.id }, //the find parameter
        { $set: storeFields }, //the updated data
        { new: true, upsert: true, setDefaultsOnInsert: true } //the upsert
      );
      return res.json(store);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  GET api/stores
// @desc   Get all stores for all users
// @access Public
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find().sort({ date: -1 });
    return res.json(stores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/stores/:store_id
// @desc     Get store by ID
// @access   Public
router.get('/:store_id', checkObjectId('store_id'), async (req, res) => {
  try {
    const store = await Store.findById(req.params.store_id);

    if (!store) {
      return res.status(404).json({ msg: 'Store not found' });
    }

    res.json(store);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Store not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/stores/:id
// @desc     Delete store
// @access   Private
router.delete(
  '/:store_id',
  [auth, checkObjectId('store_id')],
  async (req, res) => {
    try {
      const store = await Store.findById(req.params.store_id);
      if (!store) {
        return res.status(404).json({ msg: 'Store not found' });
      }
      // Check to see if deleter is store owner/user
      if (store.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      await store.remove();
      return res.json({ msg: 'Store removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/stores/follow/:id
// @desc     Follow a store
// @access   Private
router.put('/follow/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    const follower = await User.findById(req.user.id, 'username _id');
    //add to follower's profile's following list
    const followerprofile = await Profile.findOne({ user: req.user.id }).select(
      'following'
    );

    // Check if the profile has already followed
    if (
      store.storefollowers.some(
        (follow) => follow.user.toString() === req.user.id
      )
    ) {
      return res.status(400).json({ msg: 'Store already followed' });
    }
    //store into storefollowers = User.id and username and also give it a new id
    store.storefollowers.unshift({
      user: req.user.id,
      username: follower.username,
    });
    followerprofile.following.unshift({
      stores: store.id,
      name: store.storename,
    });
    await store.save();
    await followerprofile.save();
    // console.log('storefollower', store.storefollowers);
    // console.log('following', followerprofile.following);
    return res.json(store.storefollowers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/stores/unfollow/:id
// @desc     Unfollow a store
// @access   Private
router.put('/unfollow/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const follower = await Profile.findOne({ user: req.user.id }).select(
      'user following'
    );
    const store = await Store.findById(req.params.id);

    // Check if the store has not yet been followed by user
    if (
      !store.storefollowers.some(
        (follow) => follow.user.toString() === req.user.id
      )
    ) {
      return res.status(400).json({ msg: 'Store has not yet been followed' });
    }

    // remove the follower
    store.storefollowers = store.storefollowers.filter(
      ({ user }) => user.user === follower.user
    );

    //remove store from following
    follower.following = follower.following.filter(
      ({ stores }) => stores.stores === req.params.id
    );

    await store.save();
    await follower.save();

    return res.json(store.storefollowers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
