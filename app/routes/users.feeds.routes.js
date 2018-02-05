const express = require('express');
const router = express.Router();
const userFeeds = require('../controllers/users.feeds.controller');

/* GET home page. */
router.get('/', userFeeds.getFeeds)

router.post('/', userFeeds.setFeed);

router.put('/', userFeeds.update);

router.delete('/', userFeeds.remove);

module.exports = router;
