const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.get('/', UserController.getUsers);

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);


module.exports = router;