const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route  POST api/users
// @desc   Register user
// @access Public
router.post(
  '/',
  [
    check('username', 'Username is required').not().isEmpty(), //3/2-4:54
    check('email', 'Please include a valid email').isEmail(), //email exist lo poh ala register thei fo mai hemi cauh hi cuan
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    try {
      //See if user exists in DB
      let user_email = await User.findOne({ email });
      let user_name = await User.findOne({ username });
      if (user_name) {
        //3/3-6:12 for why we turn the errors here to array
        return res
          .status(400)
          .json({ errors: [{ msg: 'Username already exists' }] });
      }
      if (user_email) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already exists' }] });
      } //create instance of user and encrypt password before saving to DB
      user = new User({
        username,
        email,
        password,
      }); //encrypting password 3/3-9:20
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // jsonwebtoken
      const payload = {
        user: {
          id: user.id, //3/4-3:25
        },
      };
      //3/4-6:30
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  }
);
module.exports = router;
