const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller');
const auth = require('../controllers/login.controller')

/* GET home page. */
router.get('/', users.userById)

router.post('/', users.create);

router.put('/', auth.authenticate, users.update);

router.delete('/', auth.authenticate, users.remove);

router.get('/list', users.list);
module.exports = router;
