const express = require('express');
const router = express.Router();

// @route  GET api/explore
// @desc   Test route
// @access Public
router.get('/', (req, res) => res.send('explore route'));
module.exports = router;
