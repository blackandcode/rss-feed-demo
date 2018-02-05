const express = require('express');
const router = express.Router();
const auth = require('../controllers/login.controller');
/* GET home page. */
router.post('/login', auth.login)

router.post('/logout', auth.logout);

module.exports = router;
