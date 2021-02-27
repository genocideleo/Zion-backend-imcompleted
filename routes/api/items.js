const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Store = require('../../models/Store');
const Item = require('../../models/Item');
const e = require('express');

// @route    PUT api/items/add
// @desc     Creates item and also saves it to store's listeditems
// @access   Private
router.put(
  '/add',
  auth,
  check('name', 'Item name is required').notEmpty(),
  check('price', 'Price is required').notEmpty(),
  check('description', 'You need to add description for the item').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //creates a new item
      const store = await Store.findOne(
        { user: req.user.id },
        '_id username listeditems'
      );
      const { ...rest } = req.body;
      const newitem = new Item({
        user: req.user.id,
        store: store._id,
        seller: store.username,
        ...rest,
      });
      await newitem.save();
      // also saves item name,price,thumbnail,likes,avgrating to store's items
      store.listeditems.unshift(newitem);
      await store.save();
      return res.send(newitem);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/items
// @desc     Get all items from all store
// @access   Public
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 });
    return res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/items/:id
// @desc     Get an item by item id
// @access   Public
router.get('/:id', checkObjectId('id'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    return res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/items/store/:id
// @desc     Get all items info listed by a store
// @access   Public
router.get('/store/:id', checkObjectId('id'), async (req, res) => {
  try {
    //tah hian store find hmasa zok ta ila ...item tam deuh search aiin a speed a tha zok agem? nge item kha search leh tho a gai don?
    const items = await Item.find({ store: req.params.id });
    console.log(items);
    // await Model.find({ '_id': { $in: ids } });
    if (!items) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    return res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/items/:id
// @desc     Delete an item by item id and also removes it from store's listed items
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    //search if item exists
    const item = await Item.findById(req.params.id, '_id user');
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    // Check to see if userid owns store
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const foundstore = await Store.findOne({ user: req.user.id });
    foundstore.listeditems = foundstore.listeditems.filter(
      (e) => e._id.toString() !== req.params.id
    );

    await Promise.all([
      Item.findOneAndRemove({ _id: req.params.id }),
      foundstore.save(),
    ]);

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    PUT api/items/like/:id
// @desc     Like an item
// @access   Private
router.put('/like/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    // Check if the item has already been liked
    if (item.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Item already liked' });
    }

    item.likes.unshift({ user: req.user.id });

    await item.save();

    return res.json(item.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    // Check if the item has not yet been liked
    if (!item.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Item has not yet been liked' });
    }

    // remove the like
    item.likes = item.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await item.save();

    return res.json(item.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/items/comment/:id
// @desc     Comment on an item
// @access   Private
router.post(
  '/comment/:id',
  auth,
  checkObjectId('id'),
  check('text', 'Text is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const item = await Item.findById(req.params.id);
      const profile = await Profile.findOne(
        { user: req.user.id },
        'profilepic'
      );

      const newComment = {
        text: req.body.text,
        username: user.username,
        profilepic: profile.profilepic,
        user: req.user.id,
      };

      item.comments.unshift(newComment);

      await item.save();

      res.json(item.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/items/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    // Pull out comment
    const comment = item.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user/deleter
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    item.comments = item.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await item.save();

    return res.json(item.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
