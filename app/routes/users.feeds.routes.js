const express = require('express');
const router = express.Router();
const userFeeds = require('../controllers/users.feeds.controller');
const auth = require('../controllers/login.controller');

/* GET home page. */
router.get('/', auth.authenticate, userFeeds.getFeeds)

router.post('/', auth.authenticate, userFeeds.setFeed);

router.put('/', auth.authenticate, userFeeds.update);

router.delete('/', auth.authenticate, userFeeds.remove);

module.exports = router;
