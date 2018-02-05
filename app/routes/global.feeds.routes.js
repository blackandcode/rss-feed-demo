const express = require('express');
const router = express.Router();
const feeds = require('../controllers/global.feeds.controller');
/* GET home page. */
router.get('/', feeds.getFeeds)


module.exports = router;
