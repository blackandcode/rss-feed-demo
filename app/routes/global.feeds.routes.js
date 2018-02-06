const express = require('express');
const router = express.Router();
const feeds = require('../controllers/global.feeds.controller');
/* GET home page. */
router.post('/', feeds.getSpecificFeeds);
router.put('/', feeds.update);
router.delete('/', feeds.remove);


module.exports = router;
