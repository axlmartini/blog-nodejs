const express = require('express');

const checkAuth = require('../middleware/check-auth');

const PostListController = require('../controllers/postslist');
const router = express.Router();

router.get('/', PostListController.getAll);

router.post('/', checkAuth, PostListController.postCreate);

router.get('/:postId', PostListController.postGetSingle);

router.patch('/:postId', checkAuth, PostListController.postUpdate);

router.delete('/:postId', checkAuth, PostListController.postDelete);

module.exports = router;
