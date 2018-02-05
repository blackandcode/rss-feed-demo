const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller');

/* GET home page. */
router.get('/', users.userById)

router.post('/', users.create);

router.put('/', users.update);

router.delete('/', users.remove);

router.get('/list', users.list);
module.exports = router;
