const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Store = require('../../models/Store');
// profile will firstly have its customer profile and then can optionally add it's store profiles

// @route  GET api/profile/myprofile
// @desc   Get current users profile
// @access Private
router.get('/myprofile', auth, async (req, res) => {
  try {
    //4/2-4:00
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/profile/myprofile
// @desc   Create or update user profile
// @access Private
router.post(
  '/myprofile',
  [
    auth,
    [
      check(
        'contactnumber',
        'Please use a contact number between 4 and 15 digits'
      ).isLength({ min: 4, max: 15 }),
      check('contactemail', 'Please use a valid contact email').isEmail(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      profilepic,
      address,
      contactnumber,
      contactemail,
      whatsapp,
      facebook,
      instagram,
      youtube,
    } = req.body; //modi

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    //here the second field of findone acts as select()
    const username = await User.findOne({ _id: req.user.id }, 'username -_id');
    profileFields.username = username.username;

    if (profilepic) profileFields.profilepic = profilepic;
    // if (wallpaper) profileFields.wallpaper = wallpaper; store,mall,services bakin wallpaper an mamoh lo kati
    if (address) profileFields.address = address;
    if (contactnumber) profileFields.contactnumber = contactnumber;
    if (contactemail) profileFields.contactemail = contactemail;
    // if (havestore && stores) {
    //   profileFields.stores = stores.map((store) => store); // to modify the mapping
    // } //testing 4/3- 10:23

    // build social object
    const socialFields = { whatsapp, youtube, instagram, facebook };
    if (whatsapp) socialFields.whatsapp = whatsapp;
    if (facebook) socialFields.facebook = facebook;
    if (instagram) socialFields.instagram = instagram;
    if (youtube) socialFields.youtube = youtube;
    profileFields.social = socialFields;
    try {
      // another method without using upsert 4/3 14:15
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id }, //the find parameter
        { $set: profileFields }, //the updated data
        { new: true, upsert: true, setDefaultsOnInsert: true } //the upsert
      );

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// @route  GET api/profile
// @desc   Get all profile
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    });

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    //as to why we use err.kind for security reason check 4/4-10:30
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// need to add more stuff here...to delete shops and every related item to user including comments and likes and etc
// @route  DELETE api/profile
// @desc   Delete profile,user
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ msg: 'User and Profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
